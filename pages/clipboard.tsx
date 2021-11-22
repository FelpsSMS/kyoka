import { SearchIcon } from "@heroicons/react/outline";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import * as localForage from "localforage";
import DictionaryEntry from "../components/DictionaryEntry";
import { api, verifyToken } from "../utils/api";
import parse from "html-react-parser";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function Clipboard() {
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  const [initialQuery, setInitialQuery] = useState("");

  const [dictionaryEntries, setDictionaryEntries] = useState([]);

  const [activeDictionary, setActiveDictionary] = useState("");
  const [activeDictionaryLanguage, setActiveDictionaryLanguage] = useState("");

  const [configDone, setConfigDone] = useState(false);

  const [textContent, setTextContent] = useState("");

  const [htmlContent, setHtmlContent] = useState("");

  const divRef = useRef(null);

  const [clipboardText, setClipboardText] = useState("");

  const [wordStateChanged, setWordStateChanged] = useState(false);

  const handleClick = useCallback(
    (e) => {
      const userId = verifyToken();
      const wordToSet = e.target.innerText;

      api
        .post("word-states/set-word", {
          user: userId,
          word: wordToSet,
        })
        .then(() => {
          setWordStateChanged(!wordStateChanged);
        });
    },
    [wordStateChanged]
  );

  const getNewText = useCallback(async (data, userId, text) => {
    const decks = await Promise.all(
      data.map(async (item) => {
        const deck = await api.get(`decks/${item.deck}`).then((res) => {
          return res.data;
        });

        return { deck: deck, active: item.active };
      })
    );

    //get all cards and stats for these decks
    const cardArrayList = await Promise.all(
      decks.map(async (item: any) => {
        const cardData = await api
          .get(`cards/get_cards/${item.deck._id}`)
          .then((res) => {
            return res.data;
          });

        return cardData;
      })
    );

    //group them into a single list
    const cardList = cardArrayList.reduce((a: any, b: any) => a.concat(b), []);

    //grab relevant info
    const cardData: any = await Promise.all(
      cardList.map(async (item) => {
        const cardStats = await api
          .post(`card-stats/card`, {
            cardId: item._id,
            userId: userId,
          })
          .then((res) => {
            return res.data;
          });

        return {
          focus: item.focus,
          mature: cardStats.mature,
          state: cardStats.state,
        };
      })
    );

    const strippedString = text.replace(/(<([^>]+)>)/gi, ""); //regex for removing html tags

    console.log(strippedString.match("\\P{L}"));

    const splitString = strippedString.split(" ");

    let newText = "";

    const userWordStates = await api
      .post("word-states/by-user", {
        user: userId,
      })
      .then((res) => {
        return res.data;
      });

    splitString.map((item) => {
      let color = "bg-gray-300";
      let finalWord = item;
      let trail = "";

      const match = item.match("[^A-z\\s][\\\\^]?")
        ? item.match("[^A-z\\s][\\\\^]?")[0]
        : null;

      const permittedSpecialCharacters = ["'", "-"];

      // prettier-ignore
      //console.log(item.match(/[\p{L}-]+/ug));
      //this is a better way to do it, but, due to a nextjs bug, this doesn't work at the moment

      if (match && !permittedSpecialCharacters.includes(match)) {
        const splitMatch = item.split(match);

        finalWord = splitMatch[0];
        trail = match + splitMatch[1];
      }

      const inCards = cardData.filter((card) => item == card.focus);

      if (inCards.length > 0) {
        color = inCards[0].mature
          ? "bg-green-500"
          : inCards[0].state != 0
          ? "bg-yellow-500"
          : "bg-gray-300";
      }

      const inWordStates = userWordStates.filter((word) => item == word.word);

      if (inWordStates.length > 0) {
        color =
          inWordStates[0].state == 1
            ? "bg-yellow-500"
            : inWordStates[0].state == 2
            ? "bg-green-500"
            : "bg-gray-300";
      }

      if (item.length > 0)
        newText += `<a className="${color} font-bold rounded hover:cursor-pointer p-1">${finalWord}</a>${trail} `;
    });

    return newText;
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(() => setClipboardText(textContent), 300); //debounce
    return () => clearTimeout(timeOutId);
  }, [textContent, setTextContent]);

  useEffect(() => {
    const timeOutId = setTimeout(() => setQuery(initialQuery), 300); //debounce
    return () => clearTimeout(timeOutId);
  }, [initialQuery, setQuery]);

  useEffect(() => {
    const userId = verifyToken();

    api
      .post("users/user-info", {
        id: userId,
      })
      .then((res) => {
        const dict = res.data.activeDictionary;

        if (dict) {
          api.get(`dictionaries/${dict}`).then((res) => {
            const splitName = res.data.name.split(".");
            const dictName = splitName[0] + "_json"; //formatted name
            const language = res.data.language;

            setActiveDictionary(dictName);
            setActiveDictionaryLanguage(language);
          });
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  useEffect(() => {
    //get active decks for the specific user
    const userId = verifyToken();

    api
      .post("deck-stats/user", {
        userId: userId,
      })
      .then(async (res) => {
        const data = res.data;

        const newText = await getNewText(data, userId, clipboardText);

        setHtmlContent(newText);

        if (divRef.current.children.length > 1) {
          for (let i = 0; i < divRef.current.children.length; i++) {
            //map doesn't work
            divRef.current.children[i].onclick = (e) => handleClick(e);
          }
        } else if (divRef.current.children.length > 0) {
          divRef.current.children[0].onclick = (e) => handleClick(e);
        }
      });
  }, [clipboardText, wordStateChanged, handleClick, getNewText]);

  useEffect(() => {
    if (activeDictionary) {
      localForage.config({
        driver: localForage.INDEXEDDB, // Force WebSQL; same as using setDriver()
        name: "kyokaDicts",
        version: 1.0,
        // size: 4980736, // Size of database, in bytes. WebSQL-only for now.
        storeName: activeDictionary, // Should be alphanumeric, with underscores.
        description: "Dictionary for Kyoka",
      });

      setConfigDone(true);
    }
  }, [activeDictionary, configDone]);

  useEffect(() => {
    if (configDone) {
      localForage
        .getItem(query)
        .then(async (res: any) => {
          if (res) {
            let entryList = [];
            let queryCopy = query;

            while (queryCopy.length > 1) {
              const definition = await localForage
                .getItem(queryCopy)
                .then((res: any) => {
                  return res ? res.definition ?? null : null;
                })
                .catch((err) => {
                  console.log(err);
                });

              if (definition) {
                const entry = { term: queryCopy, text: definition };
                entryList.push(entry);
              }

              queryCopy = queryCopy.slice(0, -1);
            }

            const reversedArray = entryList.sort((a, b) => b.length + a.length);

            setDictionaryEntries(reversedArray);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [query, configDone]);

  return (
    <div className="">
      <Head>
        <title>{t("clipboard_page_title")}</title>
        <meta name="description" content="Kyoka" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <div className="flex justify-center items-center min-h-screen">
        <div
          className="bg-white flex flex-col min-h-screen w-screen items-center justify-center sm:rounded-lg 
          sm:shadow-lg sm:my-8 p-8 sm:mx-8 md:mx-16 lg:my-16 lg:mx-32 max-h-sc"
        >
          <div className="flex w-full h-full flex-col space-y-4 justify-center sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="grid grid-rows-2 min-h-screen w-full sm:w-3/5 md:w-4/5 lg:w-2/3">
              <textarea
                className="rounded-lg text-2xl overflow-scroll outline-none focus:border-2 border-black 
                          p-2 bg-gray-200 resize-none w-full h-full"
                onChange={(e) => {
                  setTextContent(e.currentTarget.value);
                }}
              />
              <div className="w-full h-full rounded-lg">
                <div className="p-4 leading-10" ref={divRef}>
                  {parse(htmlContent)}
                </div>
              </div>
            </div>
            <div className="w-full outline-none rounded-lg bg-gray-500 flex flex-col min-h-screen lg:w-1/3">
              <div className="flex items-center px-2">
                <SearchIcon className="bg-gray-900 text-white h-12 ml-2 rounded-l-lg p-2 my-4" />
                <input
                  type="text"
                  className="w-full rounded-r-lg bg-gray-200 text-xl p-2 outline-none focus:border-2 border-black my-2 mr-2
                  focus:my-1.5" //In tailwind, 2px = 0.5
                  onChange={(e: any) => {
                    if (activeDictionary)
                      setInitialQuery(e.target.value.toLowerCase());
                  }}
                />
              </div>
              <div className="overflow-y-scroll space-y-4 max-h-screen mb-4">
                {dictionaryEntries.map((item, i) => {
                  return (
                    <DictionaryEntry
                      key={i}
                      term={item.term}
                      text={item.text}
                      language={activeDictionaryLanguage}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["kyoka-token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: `/${ctx.locale}`,
        permanent: false,
      },
    };
  }

  return {
    props: { ...(await serverSideTranslations(ctx.locale, ["common"])) },
  };
};

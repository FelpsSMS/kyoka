import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Library from "../components/Library";
import LibraryNavbar from "../components/LibraryNavbar";
import Navbar from "../components/Navbar";
import { TextField } from "../components/TextField";
import ToggleButton from "../components/ToggleButton";
import * as Yup from "yup";
import { api, verifyToken } from "../utils/api";
import LoadingWheel from "../components/LoadingWheel";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import JsonDropzone from "../components/JsonDropzone";
import * as localForage from "localforage";
import DisplayLoading from "../components/DisplayLoading";

export default function preferences() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [sorting, setSorting] = useState();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [libraryChanged, setLibraryChanged] = useState("A-Z");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [enabled, setEnabled] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [lapseThreshold, setLapseThreshold] = useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [numberOfNewCards, setNumberOfNewCards] = useState(0);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [jsonResponse, setJsonResponse] = useState([{}]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [fileName, setFileName] = useState("");

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showLoadingPrompt, setShowLoadingPrompt] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const userId = verifyToken();

    api
      .post("users/user-info", {
        id: userId,
      })
      .then((res) => {
        setLapseThreshold(res.data.lapseThreshold);
        setEnabled(res.data.removeLeeches);
        setNumberOfNewCards(res.data.numberOfNewCards);

        setIsDataLoaded(true);
      });
  }, []);

  function uploadDict(values) {
    console.log(values);
  }

  function sendToServer() {
    const userId = verifyToken();

    if (lapseThreshold > 99) {
      setLapseThreshold(99);
    }

    if (numberOfNewCards > 99) {
      setNumberOfNewCards(99);
    }

    api
      .post("users/update-user-info", {
        lapseThreshold: lapseThreshold,
        removeLeeches: enabled,
        numberOfNewCards: numberOfNewCards,
        userId: userId,
      })
      .then(() => {
        //add an indicator that the save as successful
        console.log("salvo");
      });
  }

  function chunk(array, size) {
    const chunkedArray = [];
    for (var i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    console.log(fileName);

    let altReading = false;

    //in case the language has multiple scripts, like in Japanese, Korean, etc
    if (Object.keys(jsonResponse[0]).includes("altReading")) altReading = true;

    if (jsonResponse[0]["term"]) {
      setShowLoadingPrompt(true);

      localForage.config({
        driver: localForage.INDEXEDDB, // Force WebSQL; same as using setDriver()
        name: "kyokaDicts",
        version: 1.0,
        // size: 4980736, // Size of database, in bytes. WebSQL-only for now.
        storeName: fileName, // Should be alphanumeric, with underscores.
        description: "Dictionary for Kyoka",
      });

      let numberOfChunks = 1;

      const jsonSize = jsonResponse.length;

      const responseLength = jsonSize.toString().length;

      if (responseLength > 3) {
        numberOfChunks = (responseLength - 1) * 200;
      } else {
        numberOfChunks = 1;
      }

      const chunkedArray = chunk(jsonResponse, numberOfChunks);

      let counter = 0;

      chunkedArray.map(async (chunk) => {
        await Promise.all(
          chunk.map(async (item) => {
            let dictEntry;

            if (altReading) {
              dictEntry = {
                definition: item["definition"],
                altReading: item["altReading"],
              };
            } else {
              dictEntry = {
                definition: item["definition"],
              };
            }

            await localForage.setItem(item["term"], dictEntry);
            /*          .then((res) => {
              return res;
            }); */
          })
        ).then(() => {
          counter += numberOfChunks;
          setLoadingBarProgress(Math.round((counter / jsonSize) * 100));
        });
      });
    }
  }, [jsonResponse]);

  return (
    <div className="">
      <Navbar />

      <div className="flex justify-center items-center min-h-screen">
        <div
          className="bg-white flex flex-col min-h-screen w-screen items-center justify-center sm:rounded-lg 
      sm:shadow-lg sm:my-8 sm:mx-8 md:mx-16 lg:my-16 lg:mx-32"
        >
          {showLoadingPrompt && (
            <DisplayLoading
              show={showLoadingPrompt}
              setShow={() => setShowLoadingPrompt(false)}
              loadingBarProgress={loadingBarProgress}
            />
          )}
          {isDataLoaded ? (
            <div>
              <ToggleButton
                enabled={enabled}
                setEnabled={setEnabled}
                textColor={"black"}
                label={"Remover leeches"}
              />
              <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col sm:flex-row justify-center items-center">
                  <label className="m-4 font-bold text-black">
                    Limite para leeches
                  </label>
                  <input
                    name="limit"
                    type="number"
                    className="bg-gray-200 rounded-lg h-4 w-12 py-3 pl-4"
                    min="1"
                    max="99"
                    value={lapseThreshold}
                    onChange={(e: any) => setLapseThreshold(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center">
                  <label className="m-4 font-bold text-black">
                    Número de novas cartas diárias
                  </label>
                  <input
                    name="newCards"
                    type="number"
                    className="bg-gray-200 rounded-lg h-4 w-12 py-3 pl-4"
                    min="0"
                    max="99"
                    value={numberOfNewCards}
                    onChange={(e: any) => setNumberOfNewCards(e.target.value)}
                  />
                </div>

                <button
                  className="px-8 mt-4 confirmation-button sm:px-16"
                  onClick={() => sendToServer()}
                >
                  Salvar
                </button>

                {/*            <div className="w-64 h-12 m-4 bg-gray-500 p-4 items-center justify-center">
                  <div
                    className={`bg-purple-700 h-4 rounded`}
                    style={{ width: `${loadingBarProgress}%` }}
                  ></div>
                </div> */}
              </div>

              <Formik
                initialValues={{ dict: "", dictHolder: "" }}
                onSubmit={(values) => uploadDict(values)}
              >
                {(formik: any) => (
                  <Form className="flex flex-col items-center justify-center mt-8">
                    <JsonDropzone
                      label="Adicionar dicionário"
                      name="dict"
                      fileExchange={(dict) => {
                        formik.setFieldValue("dictHolder", dict);
                      }}
                      setResponse={setJsonResponse}
                      setFileName={setFileName}
                    />
                    <label>{formik.values.dictHolder.name}</label>
                    <input name="dictHolder" hidden />
                  </Form>
                )}
              </Formik>
            </div>
          ) : (
            <LoadingWheel />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["kyoka-token"]: token } = parseCookies(ctx);
  //const apiClient = getAPIClient(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  //await apiClient.get("/users");

  return { props: {} };
};

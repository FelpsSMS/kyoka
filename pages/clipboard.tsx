import { SearchIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import ClipboardNavbar from "../components/ClipboardNavbar";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageWrapper from "../components/PageWrapper";
import { TextArea } from "../components/TextArea";
import * as localForage from "localforage";
import DictionaryEntry from "../components/DictionaryEntry";

export default function clipboard() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [query, setQuery] = useState("");

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [querySize, setQuerySize] = useState(1000);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [dictionaryEntries, setDictionaryEntries] = useState([]);

  localForage.config({
    driver: localForage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name: "kyokaDicts",
    version: 1.0,
    // size: 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName: "vicon_json", // Should be alphanumeric, with underscores.
    description: "Dictionary for Kyoka",
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (query.length < querySize) {
      setQuerySize(query.length);
      setQuery(query);
      setDictionaryEntries([]);
    }

    localForage.getItem(query).then(async (res: any) => {
      if (res) {
        let entryList = [];
        let queryCopy = query;

        while (queryCopy.length > 1) {
          const definition = await localForage
            .getItem(queryCopy)
            .then((res: any) => {
              if (res) {
                return res.definition;
              } else {
                return null;
              }
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
    });
  }, [query]);

  return (
    <div className="">
      <Navbar />
      <ClipboardNavbar />

      <div className="flex justify-center items-center min-h-screen">
        <div
          className="bg-white flex flex-col min-h-screen w-screen items-center justify-center sm:rounded-lg 
          sm:shadow-lg sm:my-8 p-8 sm:mx-8 md:mx-16 lg:my-16 lg:mx-32 max-h-sc"
        >
          <div className="flex w-full h-full flex-col space-y-4 justify-center items-center sm:flex-row sm:space-y-0 sm:space-x-4">
            <textarea
              className={`rounded-lg text-2xl overflow-scroll outline-none focus:border-2 border-black 
          p-2 w-full min-h-screen bg-gray-200 resize-none`}
            />
            <div className="w-full outline-none rounded-lg bg-gray-500 flex flex-col sm:w-1/3">
              <div className="flex items-center px-2">
                <SearchIcon className="bg-gray-900 text-white h-12 ml-2 rounded-l-lg p-2 my-4" />
                <input
                  type="text"
                  className="w-full rounded-r-lg bg-gray-200 text-xl p-2 outline-none focus:border-2 border-black my-2 mr-2
              focus:my-1.5" //In tailwind, 2px = 0.5
                  onChange={(e: any) => setQuery(e.target.value)}
                />
              </div>
              <div className="overflow-y-scroll space-y-4 max-h-screen mb-4">
                {dictionaryEntries.map((item, i) => {
                  return (
                    <DictionaryEntry
                      key={i}
                      term={item.term}
                      text={item.text}
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

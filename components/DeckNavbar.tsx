import { SearchIcon } from "@heroicons/react/outline";
import router from "next/router";
import React, { useEffect, useState } from "react";
import Select from "./Select";

function DeckNavbar({ deckId, setSorting, setSearch }) {
  function handleCardCreation(id: any) {
    router.push({
      pathname: `[deckId]/create_card`,
      query: { deckId: id },
    });
  }

  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeOutId = setTimeout(() => setSearch(query), 300); //debounce
    return () => clearTimeout(timeOutId);
  }, [query, setSearch]);

  const sortingOptions = ["A-Z", "Revisão"];

  const [selectSorting, setSelectSorting] = useState();

  return (
    <nav className="bg-gray-500 flex justify-center flex-col md:flex-row">
      <div className="flex items-center md:w-2/3">
        <SearchIcon className="bg-gray-900 text-white h-12 ml-2 rounded-l-lg p-2 md:my-4" />
        <input
          type="text"
          className="w-full rounded-r-lg bg-gray-200 text-xl p-2 outline-none focus:border-2 border-black my-2 mr-2 
          focus:my-1.5" //In tailwind, 2px = 0.5
          onChange={(e: any) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex">
        <button
          className="confirmation-button mx-2 mb-2 md:mt-4 md:mb-4 md:mx-4 whitespace-nowrap w-1/2"
          onClick={() => handleCardCreation(deckId)}
        >
          Criar carta
        </button>
        <Select
          className="mx-2 mb-2 md:mt-4 md:mb-4 md:mx-4 w-1/2"
          className2="sm:px-20 font-bold bg-white py-2 text-xl w-full focus:outline-none 
          focus:shadow-outline-blue focus:border-blue-300 relative border shadow-sm 
          border-gray-300 rounded text-gray-800"
          selectedItem={selectSorting}
          setSelectedItem={setSelectSorting}
          items={sortingOptions}
          setSorting={setSorting}
        />
      </div>
    </nav>
  );
}

export default DeckNavbar;

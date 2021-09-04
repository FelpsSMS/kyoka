import { SearchIcon } from "@heroicons/react/outline";
import router from "next/router";
import React, { useState } from "react";
import NewDeckPrompt from "./NewDeckPrompt";

function LibraryNavbar(
  {
    /* deckId */
  }
) {
  /*   function handleClick(id: any) {
    router.push({
      pathname: `[deckId]/create_card`,
      query: { deckId: id },
    });
  } */

  const [showNewDeckPrompt, setShowNewDeckPrompt] = useState(false);

  function handleClick() {}

  return (
    <nav className="bg-gray-500 flex justify-center flex-col md:flex-row md:justify-end">
      <NewDeckPrompt
        show={showNewDeckPrompt}
        setShow={() => setShowNewDeckPrompt(false)}
      />
      <div className="flex items-center md:w-2/3">
        <SearchIcon className="bg-gray-900 text-white h-12 ml-2 rounded-l-lg p-2 md:my-4" />
        <input
          type="text"
          className="w-full rounded-r-lg bg-gray-200 text-xl p-2 outline-none focus:border-2 border-black my-2 mr-2 
          focus:my-1.5
            " //In tailwind, 2px = 0.5
        />
      </div>
      <button
        className="confirmation-button mx-2 mb-2 md:mt-4 md:mb-4 md:mx-4 whitespace-nowrap"
        onClick={() => setShowNewDeckPrompt(true)}
      >
        Criar deck
      </button>
      <button className="confirmation-button mx-2 mb-2 md:mt-4 md:mb-4 md:mx-4">
        Ordenar
      </button>
    </nav>
  );
}

export default LibraryNavbar;

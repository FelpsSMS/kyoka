import { SearchIcon } from "@heroicons/react/outline";
import router from "next/router";
import React, { useState } from "react";
import DeletePrompt from "./DeletePrompt";
import NewDeckPrompt from "./NewDeckPrompt";

function DeckOptionsNavbar({ deckId }) {
  const [showDeckNameChangePrompt, setShowDeckNameChangePrompt] =
    useState(false);

  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  return (
    <nav className="bg-gray-500 flex justify-center flex-col md:flex-row md:justify-end">
      <NewDeckPrompt
        show={showDeckNameChangePrompt}
        setShow={() => setShowDeckNameChangePrompt(false)}
        deckId={deckId}
      />

      <DeletePrompt
        show={showDeletePrompt}
        setShow={() => setShowDeletePrompt(false)}
        id={deckId}
        routeName={"decks"}
        title="Você realmente deseja excluir este deck?"
      />

      <button
        className="confirmation-button mx-2 mb-2 mt-2 md:mt-4 md:mb-4 md:mx-4 whitespace-nowrap"
        onClick={() => setShowDeckNameChangePrompt(true)}
      >
        Alterar nome do deck
      </button>
      <button
        className="confirmation-button mx-2 mb-2 md:mt-4 md:mb-4 md:mx-4"
        onClick={() => setShowDeletePrompt(true)}
      >
        Excluir deck
      </button>
    </nav>
  );
}

export default DeckOptionsNavbar;

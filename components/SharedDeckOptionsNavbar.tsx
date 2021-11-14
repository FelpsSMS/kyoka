import { SearchIcon } from "@heroicons/react/outline";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { api, verifyToken } from "../utils/api";
import AddSharedDeckPrompt from "./AddSharedDeckPrompt";
import DeletePrompt from "./DeletePrompt";
import HeadsUpMessage from "./HeadsUpMessage";
import ErrorMessage from "./HeadsUpMessage";
import NewDeckPrompt from "./NewDeckPrompt";
import ToggleButton from "./ToggleButton";

function SharedDeckOptionsNavbar({ deckId }) {
  const [showAddSharedDeckPrompt, setShowAddSharedDeckPrompt] = useState(false);

  const [showErrorMessage, setShowErrorMessage] = useState(false);

  return (
    <nav className="bg-gray-500 flex items-center flex-row justify-center sm:justify-end">
      {/*@ts-ignore: Unreachable code error*/}
      <AddSharedDeckPrompt
        show={showAddSharedDeckPrompt}
        setShow={() => setShowAddSharedDeckPrompt(false)}
        id={deckId}
        title="Você realmente deseja adicionar este deck à sua biblioteca?"
        setShowErrorMessage={setShowErrorMessage}
      />
      <HeadsUpMessage
        show={showErrorMessage}
        setShow={() => setShowErrorMessage(false)}
        title="Você já possui este deck"
        color={"red"}
      />

      <div className="flex flex-col sm:flex-row">
        <button
          className="confirmation-button mx-2 mb-2 mt-2 md:mt-4 md:mb-4 md:mx-4"
          onClick={() => setShowAddSharedDeckPrompt(true)}
        >
          Adicionar deck à biblioteca
        </button>
      </div>
    </nav>
  );
}

export default SharedDeckOptionsNavbar;

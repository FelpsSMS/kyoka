import React, { useState } from "react";

import AddSharedDeckPrompt from "./AddSharedDeckPrompt";
import HeadsUpMessage from "./modals/HeadsUpMessage";

export default function SharedDeckOptionsNavbar({ deckId }) {
  const [showAddSharedDeckPrompt, setShowAddSharedDeckPrompt] = useState(false);

  const [showErrorMessage, setShowErrorMessage] = useState(false);

  return (
    <nav className="bg-gray-500 flex items-center flex-row justify-center sm:justify-end">
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
        color="bg-red-800"
        colorFocusOrHover="bg-red-900"
      />

      <div className="flex flex-col sm:flex-row">
        <button
          className="confirmation-button mx-2 mb-2 mt-2 md:mt-4 md:mb-4 md:mx-4"
          onClick={() => setShowAddSharedDeckPrompt(true)}
        >
          Adicionar à biblioteca
        </button>
      </div>
    </nav>
  );
}

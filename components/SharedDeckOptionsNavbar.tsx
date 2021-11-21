import React, { useState } from "react";

import AddSharedDeckPrompt from "./AddSharedDeckPrompt";
import HeadsUpMessage from "./modals/HeadsUpMessage";
import { useTranslation } from "next-i18next";

export default function SharedDeckOptionsNavbar({ deckId }) {
  const [showAddSharedDeckPrompt, setShowAddSharedDeckPrompt] = useState(false);

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="bg-gray-500 flex items-center flex-row justify-center sm:justify-end">
      <AddSharedDeckPrompt
        show={showAddSharedDeckPrompt}
        setShow={() => setShowAddSharedDeckPrompt(false)}
        id={deckId}
        title={t("add_to_library_confirm")}
        setShowErrorMessage={setShowErrorMessage}
      />
      <HeadsUpMessage
        show={showErrorMessage}
        setShow={() => setShowErrorMessage(false)}
        title={t("deck_already_exists")}
        color="bg-red-800"
        colorFocusOrHover="bg-red-900"
      />

      <div className="flex flex-col sm:flex-row">
        <button
          className="confirmation-button mx-2 mb-2 mt-2 md:mt-4 md:mb-4 md:mx-4"
          onClick={() => setShowAddSharedDeckPrompt(true)}
        >
          {t("add_to_library")}
        </button>
      </div>
    </nav>
  );
}

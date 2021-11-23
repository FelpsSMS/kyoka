import React, { useEffect, useState } from "react";
import { api, verifyToken } from "../utils/api";
import DeletePrompt from "./modals/DeletePrompt";
import NewDeckPrompt from "./modals/NewDeckPrompt";
import { useTranslation } from "next-i18next";

import ToggleButton from "./ToggleButton";

export default function DeckOptionsNavbar({ deckId, readOnly }) {
  const [showDeckNameChangePrompt, setShowDeckNameChangePrompt] =
    useState(false);

  const [enabled, setEnabled] = useState(true);
  const [toggleLoaded, setToggleLoaded] = useState(false);

  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const userId = verifyToken();

    if (deckId) {
      api
        .post("/deck-stats/stats", {
          deckId: deckId,
          userId: userId,
        })
        .then((res) => {
          setEnabled(res.data.active);

          setToggleLoaded(true);
        });
    }
  }, [deckId]);

  useEffect(() => {
    const userId = verifyToken();

    if (deckId && toggleLoaded) {
      api
        .post(`/deck-stats/update`, {
          deckId: deckId,
          userId: userId,
          updateBody: { active: enabled },
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [enabled, deckId, toggleLoaded]);

  return (
    <nav
      className={`bg-gray-500 flex items-center flex-row ${
        readOnly ? "justify-center sm:justify-end" : "justify-between"
      }`}
    >
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
        title={t("delete_deck_confirmation_msg")}
      />

      {toggleLoaded && !readOnly && (
        <ToggleButton
          enabled={enabled}
          setEnabled={setEnabled}
          textColor={"white"}
          label={t("activate_deck")}
        />
      )}

      <div className="flex flex-col sm:flex-row">
        {!readOnly && (
          <button
            className="confirmation-button sm:px-8 md:px-16 mx-2 mb-2 mt-2 md:mt-4 md:mb-4 md:mx-4 whitespace-nowrap"
            onClick={() => setShowDeckNameChangePrompt(true)}
          >
            {t("update_deck")}
          </button>
        )}

        <button
          className="confirmation-button mx-2 mb-2 mt-2 md:mt-4 md:mb-4 md:mx-4 whitespace-nowrap"
          onClick={() => setShowDeletePrompt(true)}
        >
          {t("delete_deck")}
        </button>
      </div>
    </nav>
  );
}

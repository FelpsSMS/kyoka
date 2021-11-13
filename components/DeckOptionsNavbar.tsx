import { SearchIcon } from "@heroicons/react/outline";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { api, verifyToken } from "../utils/api";
import DeletePrompt from "./DeletePrompt";
import NewDeckPrompt from "./NewDeckPrompt";
import ToggleButton from "./ToggleButton";

function DeckOptionsNavbar({ deckId, readOnly }) {
  const [showDeckNameChangePrompt, setShowDeckNameChangePrompt] =
    useState(false);

  const [enabled, setEnabled] = useState(true);
  const [toggleLoaded, setToggleLoaded] = useState(false);

  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  useEffect(() => {
    const userId = verifyToken();

    if (deckId) {
      api
        .post("/deck-stats/stats", {
          deckId: deckId,
          userId: userId,
        })
        .then((res) => {
          console.log(res.data);

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
      {/*@ts-ignore: Unreachable code error*/}
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

      {toggleLoaded && !readOnly && (
        <ToggleButton
          enabled={enabled}
          setEnabled={setEnabled}
          textColor={"white"}
          label={"Ativar deck"}
        />
      )}

      <div className="flex flex-col sm:flex-row">
        {!readOnly && (
          <button
            className="confirmation-button sm:px-8 md:px-16 mx-2 mb-2 mt-2 md:mt-4 md:mb-4 md:mx-4 whitespace-nowrap"
            onClick={() => setShowDeckNameChangePrompt(true)}
          >
            Alterar nome do deck
          </button>
        )}

        <button
          className="confirmation-button mx-2 mb-2 mt-2 md:mt-4 md:mb-4 md:mx-4 whitespace-nowrap"
          onClick={() => setShowDeletePrompt(true)}
        >
          Excluir deck
        </button>
      </div>
    </nav>
  );
}

export default DeckOptionsNavbar;

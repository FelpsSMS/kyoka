import { SearchIcon } from "@heroicons/react/outline";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import DeletePrompt from "./DeletePrompt";
import NewDeckPrompt from "./NewDeckPrompt";
import ToggleButton from "./ToggleButton";

function DeckOptionsNavbar({ deckId }) {
  const [showDeckNameChangePrompt, setShowDeckNameChangePrompt] =
    useState(false);

  const [enabled, setEnabled] = useState(true);
  const [toggleLoaded, setToggleLoaded] = useState(false);

  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  useEffect(() => {
    if (deckId) {
      api
        .post("/deck-stats/stats", {
          deckId: deckId,
        })
        .then((res) => {
          console.log(res.data[0].active);
          setEnabled(res.data[0].active);

          setToggleLoaded(true);
        });
    }
  }, [deckId]);

  useEffect(() => {
    if (deckId && toggleLoaded) {
      api
        .post(`/deck-stats/update`, {
          deckId: deckId,
          updateBody: { active: enabled },
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [enabled, deckId, toggleLoaded]);

  return (
    <nav className="bg-gray-500 flex items-center flex-row justify-between">
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

      <ToggleButton enabled={enabled} setEnabled={setEnabled} />

      <div className="flex flex-col sm:flex-row">
        <button
          className="confirmation-button sm:px-8 md:px-16 mx-2 mb-2 mt-2 md:mt-4 md:mb-4 md:mx-4 whitespace-nowrap"
          onClick={() => setShowDeckNameChangePrompt(true)}
        >
          Alterar nome do deck
        </button>
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

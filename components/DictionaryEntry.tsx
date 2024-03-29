import { SaveIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import GenerateCardPrompt from "./modals/GenerateCardPrompt";
import HeadsUpMessage from "./modals/HeadsUpMessage";
import PlayAudioButton from "./PlayAudioButton";
import { useTranslation } from "next-i18next";

export default function DictionaryEntry({ term, text, language }) {
  const splitText = text.split("<br>");

  const [audio, setAudio] = useState("");

  const [showSentencePrompt, setShowSentencePrompt] = useState(false);

  const [showMessage, setShowMessage] = useState(false);

  const { t } = useTranslation();

  function handleSuccessHeadsUp() {
    setTimeout(() => setShowMessage(true), 500); //temporary fix for a headless ui bug that locks the scrollbar
  }

  useEffect(() => {
    api
      .post("automatic-card-creation/get-audio", {
        focus: term,
      })
      .then((res) => {
        const hasAudio = res ? res.data ?? null : null;

        if (hasAudio) setAudio(res.data);
      });
  }, [term]);

  return (
    <div className="bg-gray-200 rounded flex flex-col items-center justify-center mx-4 relative">
      <GenerateCardPrompt
        show={showSentencePrompt}
        setShow={() => setShowSentencePrompt(false)}
        term={term}
        text={splitText}
        showMessageInside={(showMessageInside) => {
          if (showMessageInside) handleSuccessHeadsUp();
        }}
        language={language}
      />
      <HeadsUpMessage
        show={showMessage}
        setShow={() => setShowMessage(false)}
        title={t("add_card_success_msg")}
        color="bg-blue-800"
        colorFocusOrHover="bg-blue-900"
      />
      <div className="border border-b-black">
        <label className="text-3xl font-bold">{term}</label>

        <div
          className="absolute 
          top-2 right-2 space-x-2 flex"
        >
          <SaveIcon
            className="hover:cursor-pointer"
            style={{ width: "2em", height: "2em" }}
            onClick={() => setShowSentencePrompt(true)}
          ></SaveIcon>
          <PlayAudioButton
            audio={audio}
            width={"2em"}
            height={"2em"}
          ></PlayAudioButton>
        </div>
      </div>

      <div className="m-4">
        {splitText.map((line, i) => {
          return <p key={i}>{line}</p>;
        })}
      </div>
    </div>
  );
}

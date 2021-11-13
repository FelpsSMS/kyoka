import React, { useEffect, useState } from "react";
import { api, verifyToken } from "../utils/api";
import GenerateCardPrompt from "./GenerateCardPrompt";
import PlayAudioButton from "./PlayAudioButton";

export default function DictionaryEntry({ term, text }) {
  const splitText = text.split("<br>");

  const [audio, setAudio] = useState("");

  const [showSentencePrompt, setShowSentencePrompt] = useState(false);

  useEffect(() => {
    api
      .post("automatic-card-creation/get-audio", {
        focus: term,
      })
      .then((res) => {
        if (res) {
          if (res.data) setAudio(res.data);
        }
      });
  }, [term]);

  async function handleClick() {
    setShowSentencePrompt(true);
  }

  return (
    <div className="bg-gray-200 rounded flex flex-col items-center justify-center mx-4 relative">
      {showSentencePrompt && (
        <GenerateCardPrompt
          show={showSentencePrompt}
          setShow={setShowSentencePrompt}
          term={term}
          text={splitText}
        />
      )}
      <div className="border border-b-black">
        <label className="text-3xl font-bold">{term}</label>

        <div
          className="absolute 
          top-2 right-2 space-x-2 flex"
        >
          <button
            className=" bg-purple-800  hover:cursor-pointer rounded-full"
            style={{ width: "2em", height: "2em" }}
            onClick={() => handleClick()}
          ></button>
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

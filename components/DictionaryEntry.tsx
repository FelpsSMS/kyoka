import React, { useEffect, useState } from "react";
import { api, verifyToken } from "../utils/api";
import PlayAudioButton from "./PlayAudioButton";

export default function DictionaryEntry({ term, text }) {
  const splitText = text.split("<br>");

  const [audio, setAudio] = useState("");

  /*   function handleAudioPlay() {
    console.log("audio");
  } */

  useEffect(() => {
    const userId = verifyToken();

    console.log(term);

    api
      .post("automatic-card-creation/details", {
        focus: term,
      })
      .then((res) => {
        if (res) {
          console.log(res.data);
          if (res.data.audio) setAudio(res.data.audio);
        }
      });
  }, [term]);

  function handleClick() {
    const userId = verifyToken();
  }

  return (
    <div className="bg-gray-200 rounded flex flex-col items-center justify-center mx-4 relative">
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

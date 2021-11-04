import { Formik, Form } from "formik";
import { TextField } from "./TextField";
import * as Yup from "yup";
import { TextArea } from "./TextArea";
import React from "react";
import ImageDropzone from "./ImageDropzone";
import AudioDropzone from "./AudioDropzone";
import axios from "axios";
import { api, verifyToken } from "../utils/api";
import router from "next/router";

export const NewCardForm = ({ deckId }) => {
  const validate = Yup.object({
    focus: Yup.string().required(
      "Por favor, adicione um foco. Isso pode ser uma palavra ou expressão"
    ),
  });

  function sendToServer(values) {
    const files = { sentenceAudio: "", focusAudio: "" };

    if (values.sentenceAudioHolder.name !== "") {
      files["sentenceAudio"] = values.sentenceAudioHolder;
    }

    if (values.focusAudioHolder.name !== "") {
      files["focusAudio"] = values.focusAudioHolder;
    }

    const images = [
      values.image1Holder,
      values.image2Holder,
      values.image3Holder,
      values.image4Holder,
    ];

    files["images"] = images.filter((image) => {
      return image !== "";
    });

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    let fd = new FormData();

    files["images"].map((image) => {
      fd.append("images", image);
    });

    fd.append("sentence_audio", files["sentenceAudio"]);
    fd.append("focus_audio", files["focusAudio"]);

    fd.append("deck", deckId);
    fd.append("sentence", values.sentence);
    fd.append("focus", values.focus);
    fd.append("bilingualDescription", values.bilingualDescription);
    fd.append("monolingualDescription", values.monolingualDescription);
    fd.append("translation", values.translation);
    fd.append("notes", values.notes);

    api
      .post(`cards/`, fd, config)
      .then((res) => {
        //Get card ID
        const cardId = res.data._id;

        //Get user ID from jwt token
        const userId = verifyToken();

        //Create SRS stats for the card
        api
          .post("/card-stats", {
            card: cardId,
            user: userId,
          })
          .then(() => router.back()); //redirect user to the deck page
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <Formik
      initialValues={{
        sentence: "",
        focus: "",
        bilingualDescription: "",
        monolingualDescription: "",
        sentenceAudio: "",
        sentenceAudioHolder: { name: "" },
        focusAudio: "",
        focusAudioHolder: { name: "" },
        image1: "",
        image2: "",
        image3: "",
        image4: "",
        translation: "",
        notes: "",
        image1Holder: "",
        image2Holder: "",
        image3Holder: "",
        image4Holder: "",
      }}
      validationSchema={validate}
      onSubmit={(values) => sendToServer(values)}
    >
      {(formik) => (
        <Form
          className="bg-white flex flex-col justify-center items-center sm:my-8 space-y-8 w-full
        sm:shadow-lg sm:rounded-lg sm:w-4/5 sm:items-start sm:justify-start p-4
        whitespace-nowrap"
        >
          <h1 className="font-black text-3xl sm:text-5xl">Registrar carta</h1>

          <div className="flex flex-col w-full space-y-4">
            <TextField label="Frase" name="sentence" type="text" />
            <TextField label="Foco" name="focus" type="text" />
            <TextArea
              label="Descrição bilíngue"
              name="bilingualDescription"
              type="text"
            />
            <TextArea
              label="Descrição monolíngue"
              name="monolingualDescription"
              type="text"
            />

            <AudioDropzone
              label="Áudio da frase"
              name="sentenceAudio"
              fileExchange={(audio) => {
                formik.setFieldValue("sentenceAudioHolder", audio);
              }}
            />
            <label>{formik.values.sentenceAudioHolder.name}</label>

            <input name="sentenceAudioHolder" hidden />
            <input name="focusAudioHolder" hidden />

            <AudioDropzone
              label="Áudio do foco"
              name="focusAudio"
              fileExchange={(audio) => {
                formik.setFieldValue("focusAudioHolder", audio);
              }}
            />

            <label>{formik.values.focusAudioHolder.name}</label>

            <label className="font-normal text-xl">Imagens</label>

            <input type="file" name="image1Holder" hidden />
            <input type="file" name="image2Holder" hidden />
            <input type="file" name="image3Holder" hidden />
            <input type="file" name="image4Holder" hidden />

            <div className="flex flex-wrap flex-col space-y-4 xs:space-x-4 xs:space-y-0 xs:flex-row">
              <div className="flex space-x-4 xs:space-x-4">
                <ImageDropzone
                  name="image1"
                  fileExchange={(image) => {
                    formik.setFieldValue("image1Holder", image);
                  }}
                />

                <ImageDropzone
                  name="image2"
                  fileExchange={(image) => {
                    formik.setFieldValue("image2Holder", image);
                  }}
                />
              </div>

              <div className="flex space-x-4 xs:space-x-4">
                <ImageDropzone
                  name="image3"
                  fileExchange={(image) => {
                    formik.setFieldValue("image3Holder", image);
                  }}
                />
                <ImageDropzone
                  name="image4"
                  fileExchange={(image) => {
                    formik.setFieldValue("image4Holder", image);
                  }}
                />
              </div>
            </div>

            <TextField
              label="Tradução da frase"
              name="translation"
              type="text"
            />

            <TextArea label="Observações" name="notes" type="text" />
          </div>

          <button className="confirmation-button" type="submit">
            Criar
          </button>
        </Form>
      )}
    </Formik>
  );
};

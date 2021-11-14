import { Formik, Form } from "formik";
import { TextField } from "./TextField";
import * as Yup from "yup";
import { TextArea } from "./TextArea";
import React, { useRef, useState } from "react";
import ImageDropzone from "./ImageDropzone";
import AudioDropzone from "./AudioDropzone";
import axios from "axios";
import DeletePrompt from "./DeletePrompt";
import { api } from "../utils/api";
import { useRouter } from "next/router";

export const CardInfoUpdateForm = ({ cardDetails: card, readOnly }) => {
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const router = useRouter();

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

    files["images"] = images.map((image, i) => {
      return image === "" && card.images[i] ? card.images[i] : image;
    });

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    let fd = new FormData();

    files["images"].map((image) => {
      if (typeof image.name == "string") {
        fd.append("images", image);
      } else {
        fd.append("imageStrings", image);
      }
    });

    fd.append("sentence_audio", files["sentenceAudio"]);
    fd.append("focus_audio", files["focusAudio"]);

    fd.append("deck", card.deckId);
    fd.append("sentence", values.sentence);
    fd.append("focus", values.focus);
    fd.append("bilingualDescription", values.bilingualDescription);
    fd.append("monolingualDescription", values.monolingualDescription);
    fd.append("translation", values.translation);
    fd.append("notes", values.notes);

    //fd.append("dateAdded", card.dateAdded);
    //fd.append("dateDue", card.dateDue);
    //fd.append("lapses", card.lapses);

    api
      .patch(`cards/${card.id}`, fd, config)
      .then(() => router.back())
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Formik
      initialValues={{
        sentence: card.sentence,
        focus: card.focus,
        bilingualDescription: card.bilingualDescription,
        monolingualDescription: card.monolingualDescription,
        sentenceAudio: card.sentenceAudio.name,
        sentenceAudioHolder: { name: "" },
        //card.sentenceAudio === [] ? { name: "" } : card.sentenceAudio,
        focusAudio: card.focusAudio.name,
        focusAudioHolder: { name: "" },
        //card.focusAudio === [] ? { name: "" } : card.focusAudio,
        image1: card.images[0].url,
        image2: card.images[1].url,
        image3: card.images[2].url,
        image4: card.images[3].url,
        translation: card.translation ?? "",
        notes: card.notes ?? "",
        image1Holder: "",
        image2Holder: "",
        image3Holder: "",
        image4Holder: "",
      }}
      validationSchema={validate}
      onSubmit={(values) => sendToServer(values)}
    >
      {(formik) => (
        <div>
          <DeletePrompt
            show={showDeletePrompt}
            setShow={() => setShowDeletePrompt(false)}
            id={card.id}
            routeName={"cards"}
            title="Você realmente deseja excluir esta carta?"
          />
          <Form className="flex flex-col flex-wrap m-4">
            <div className="flex flex-col w-full space-y-4">
              <TextField
                label="Frase"
                name="sentence"
                type="text"
                readOnly={readOnly}
              />
              <TextField
                label="Foco"
                name="focus"
                type="text"
                readOnly={readOnly}
              />
              <TextArea
                label="Descrição bilíngue"
                name="bilingualDescription"
                type="text"
                readOnly={readOnly}
              />
              <TextArea
                label="Descrição monolíngue"
                name="monolingualDescription"
                type="text"
                readOnly={readOnly}
              />
              <AudioDropzone
                label="Áudio da frase"
                name="sentenceAudio"
                webSource={card.sentenceAudio}
                fileExchange={(audio) => {
                  formik.setFieldValue("sentenceAudioHolder", audio);
                }}
                readOnly={readOnly}
              />
              <label>{formik.values.sentenceAudioHolder.name}</label>
              <input name="sentenceAudioHolder" hidden />
              <input name="focusAudioHolder" hidden />
              <AudioDropzone
                label="Áudio do foco"
                name="focusAudio"
                webSource={card.focusAudio}
                fileExchange={(audio) => {
                  formik.setFieldValue("focusAudioHolder", audio);
                }}
                readOnly={readOnly}
              />
              <label>{formik.values.focusAudioHolder.name}</label>
              <label className="text-xl font-normal">Imagens</label>
              <input type="file" name="image1Holder" hidden />
              <input type="file" name="image2Holder" hidden />
              <input type="file" name="image3Holder" hidden />
              <input type="file" name="image4Holder" hidden />
              <div className="flex flex-col flex-wrap space-y-4 xs:space-x-4 xs:space-y-0 xs:flex-row">
                <div className="flex space-x-4 xs:space-x-4">
                  <ImageDropzone
                    name="image1"
                    webSource={card.images[0].url}
                    fileExchange={(image) => {
                      formik.setFieldValue("image1Holder", image);
                    }}
                    readOnly={readOnly}
                  />
                  <ImageDropzone
                    name="image2"
                    webSource={card.images[1].url}
                    fileExchange={(image) => {
                      formik.setFieldValue("image2Holder", image);
                    }}
                    readOnly={readOnly}
                  />
                </div>
                <div className="flex space-x-4 xs:space-x-4">
                  <ImageDropzone
                    name="image3"
                    webSource={card.images[2].url}
                    fileExchange={(image) => {
                      formik.setFieldValue("image3Holder", image);
                    }}
                    readOnly={readOnly}
                  />
                  <ImageDropzone
                    name="image4"
                    webSource={card.images[3].url}
                    fileExchange={(image) => {
                      formik.setFieldValue("image4Holder", image);
                    }}
                    readOnly={readOnly}
                  />
                </div>
              </div>
              <TextField
                label="Tradução da frase"
                name="translation"
                type="text"
                readOnly={readOnly}
              />
              <TextArea
                label="Observações"
                name="notes"
                type="text"
                readOnly={readOnly}
              />
            </div>
            {!readOnly && (
              <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                <button
                  className="px-8 mt-4 confirmation-button sm:px-16"
                  type="submit"
                >
                  Atualizar
                </button>
                <button
                  className="px-8 mt-4 confirmation-button sm:px-16"
                  onClick={() => setShowDeletePrompt(true)}
                  type="button"
                >
                  Excluir
                </button>
              </div>
            )}
          </Form>
        </div>
      )}
    </Formik>
  );
};

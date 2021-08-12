import { Formik, Form } from "formik";
import { TextField } from "./TextField";
import * as Yup from "yup";
import { TextArea } from "./TextArea";
import React from "react";
import ImageDropzone from "./ImageDropzone";
import AudioDropzone from "./AudioDropzone";
import axios from "axios";

export const CardInfoUpdateForm = ({ deckId }) => {
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

    axios
      .post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/cards/`, fd, config)
      .then()
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
        <Form className="flex flex-col flex-wrap m-4">
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

            <label className="text-xl font-normal">Imagens</label>

            <input type="file" name="image1Holder" hidden />
            <input type="file" name="image2Holder" hidden />
            <input type="file" name="image3Holder" hidden />
            <input type="file" name="image4Holder" hidden />

            <div className="flex flex-col flex-wrap space-y-4 xs:space-x-4 xs:space-y-0 xs:flex-row">
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

          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            <button
              className="px-8 mt-4 confirmation-button sm:px-16"
              type="submit"
            >
              Atualizar
            </button>
            <button
              className="px-8 mt-4 confirmation-button sm:px-16"
              type="submit"
            >
              Excluir
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

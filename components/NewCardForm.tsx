import { Formik, Form } from "formik";
import { TextField } from "./TextField";
import * as Yup from "yup";
import { TextArea } from "./TextArea";
import React from "react";
import ImageDropzone from "./ImageDropzone";
import AudioDropzone from "./AudioDropzone";

export const NewCardForm = ({ deckId }) => {
  const validate = Yup.object({
    focus: Yup.string().required(
      "Por favor, adicione um foco. Isso pode ser uma palavra ou expressão"
    ),
  });

  function sendToServer(values) {
    console.log(values);
    console.log(deckId);
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
          className="bg-white flex flex-col justify-center items-center w-full space-y-8 
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

            <div className="flex space-x-4">
              <ImageDropzone
                name="image1"
                fileExchange={(image) => {
                  formik.setFieldValue("image1Holder", image);
                }}
              />

              <input type="file" name="image1Holder" hidden />
              <input type="file" name="image2Holder" hidden />
              <input type="file" name="image3Holder" hidden />
              <input type="file" name="image4Holder" hidden />

              <ImageDropzone
                name="image2"
                fileExchange={(image) => {
                  formik.setFieldValue("image2Holder", image);
                }}
              />
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

            <TextField
              label="Tradução da frase"
              name="translation"
              type="text"
            />

            <TextArea label="Observações" name="notes" type="text" />
          </div>

          <button
            className="bg-gray-900 text-white p-2 px-16 rounded-sm text-xl font-bold focus:text-gray-200 
            focus:bg-black hover:text-gray-200 hover:bg-black outline-none"
            type="submit"
          >
            Criar
          </button>
        </Form>
      )}
    </Formik>
  );
};

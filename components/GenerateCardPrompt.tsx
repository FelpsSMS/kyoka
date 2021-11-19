import { Dialog } from "@headlessui/react";
import { Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef } from "react";
import { TextField } from "./TextField";

import { api, verifyToken } from "../utils/api";

export default function GenerateCardPrompt({
  show,
  setShow,
  term,
  text,
  setShowMessage,
}) {
  const sentenceField = useRef(null);

  async function sendToServer(values) {
    const userId = verifyToken();

    api
      .post("automatic-card-creation/generate-card", {
        focus: term,
        sentence: values.sentence,
      })
      .then(async (res) => {
        if (res) {
          const defaultDeckForGeneratedCards = await api
            .post("users/user-info", {
              id: userId,
            })
            .then((res) => {
              return res.data.defaultDeckForGeneratedCards;
            });

          console.log(res.data.images);
          console.log(defaultDeckForGeneratedCards);

          api
            .post("cards/create-without-files", {
              focus: term,
              bilingualDescription: text.join("\n"),
              monolingualDescription: res.data.definition,
              sentence: res.data.sentence,
              focusAudio: res.data.audio,
              translation: res.data.translation,
              sentenceAudio: res.data.t2sAudio,
              images: res.data.images,
              deck: defaultDeckForGeneratedCards,
              user: userId,
            })
            .then((res) => {
              api
                .post("/card-stats", {
                  card: res.data._id,
                  user: userId,
                })
                .then(() => {
                  //show a success message
                  setShowMessage(true);
                  setShow(false);
                });
            })
            .catch((err) => {
              console.log(err.response);
            });
        }
      });
  }

  return (
    <AnimatePresence>
      {show && ( //needed for a bug with nextjs
        <Dialog
          static
          initialFocus={sentenceField}
          open={show}
          onClose={() => {}}
          className=""
        >
          {({ open }) => (
            <>
              {/* Trick to center a fixed div */}
              {open && (
                <Dialog.Overlay
                  className="fixed h-screen w-screen bg-black z-50 inset-0 mx-auto 
                  flex items-center justify-center"
                  as={motion.div}
                  initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }} //Opacity is inherited, backgroundColor isn't
                  animate={{
                    height: "auto",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="bg-white fixed flex flex-col items-center justify-center space-y-8 opacity-100 
                    p-4 sm:p-8 rounded-lg shadow-lg mx-2"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Dialog.Title className="text-xl font-bold sm:text-2xl">
                      Deseja adicionar uma frase? Para tentar gerar uma frase
                      automaticamente, deixe o campo em branco
                    </Dialog.Title>
                    <Formik
                      initialValues={{
                        sentence: "",
                      }}
                      onSubmit={(values) => sendToServer(values)}
                    >
                      {(formik) => (
                        <Form className="w-full space-y-8">
                          <TextField
                            label=""
                            type="text"
                            innerref={sentenceField}
                            name="sentence"
                            className="bg-gray-100 border-2 border-gray-200 rounded-lg w-full outline-none focus:border-black p-2"
                          />

                          <div className="flex space-x-2 sm:space-x-8">
                            <button
                              className="bg-blue-800 text-white p-2 sm:px-16 rounded-sm text-xl font-bold focus:text-gray-200 
                            focus:bg-blue-900 hover:text-gray-200 hover:bg-blue-900 outline-none px-2"
                              type="submit"
                              onClick={() => {
                                formik.submitForm();
                              }}
                            >
                              Confirmar
                            </button>

                            <button
                              className="confirmation-button px-2 sm:px-16"
                              onClick={() => setShow()}
                            >
                              Cancelar
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </motion.div>
                </Dialog.Overlay>
              )}
            </>
          )}
        </Dialog>
      )}
    </AnimatePresence>
  );
}

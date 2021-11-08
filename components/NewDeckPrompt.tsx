import { Dialog } from "@headlessui/react";
import { Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import { TextField } from "./TextField";

import { api, verifyToken } from "../utils/api";

interface newDeckPromptProps {
  show: boolean;
  setShow: any;
  deckId?: string;
  libraryChanged: boolean;
  setLibraryChanged: any;
}

function NewDeckPrompt({
  show,
  setShow,
  deckId,
  libraryChanged,
  setLibraryChanged,
}: newDeckPromptProps) {
  const completeButtonRef = useRef(null);
  const deckNameFieldRef = useRef(null);

  const maxNameSize = 10;

  const validate = Yup.object({
    deckName: Yup.string()
      .required("Por favor, adicione um nome")
      .max(
        maxNameSize,
        `O nome não pode ultrapassar ${maxNameSize} caracteres`
      ),
  });

  async function sendToServer(values) {
    const deckName = values.deckName;

    //if deck id is passed, then update
    if (deckId) {
      api
        .patch(`/decks/${deckId}`, {
          name: deckName,
        })
        .then()
        .catch((err) => {
          console.log(err);
        });
    } else {
      //if not, create a new deck
      api
        .post(`/decks`, {
          name: deckName,
        })
        .then((res) => {
          const recentlyCreatedId = res.data._id;

          //Get user ID from jwt token
          const userId = verifyToken();

          //Create SRS stats for the deck

          api
            .post("/deck-stats", {
              user: userId,
              active: true,
              deck: recentlyCreatedId,
              readOnly: false,
            })
            .then(() => {
              setLibraryChanged(!libraryChanged);
              setShow();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
    <AnimatePresence>
      {show && ( //needed for a bug with nextjs
        <Dialog
          static
          initialFocus={deckNameFieldRef}
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
                      Insira o nome do deck
                    </Dialog.Title>
                    <Formik
                      initialValues={{
                        deckName: "",
                      }}
                      validationSchema={validate}
                      onSubmit={(values) => sendToServer(values)}
                    >
                      {(formik) => (
                        <Form className="w-full space-y-8">
                          <TextField
                            label=""
                            type="text"
                            innerref={deckNameFieldRef}
                            name="deckName"
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
                              ref={completeButtonRef}
                              onClick={setShow}
                              type="button"
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

export default NewDeckPrompt;

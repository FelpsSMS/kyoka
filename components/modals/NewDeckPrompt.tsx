import { Dialog } from "@headlessui/react";
import { Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { api, verifyToken } from "../../utils/api";
import Select from "../Select";
import { TextField } from "../TextField";
import { useTranslation } from "next-i18next";

interface newDeckPromptProps {
  show: boolean;
  setShow: any;
  deckId?: string;
  libraryChanged: boolean;
  setLibraryChanged: any;
}

export default function NewDeckPrompt({
  show,
  setShow,
  deckId,
  libraryChanged,
  setLibraryChanged,
}: newDeckPromptProps) {
  const completeButtonRef = useRef(null);
  const deckNameFieldRef = useRef(null);
  const { t } = useTranslation();

  const [selectedLayout, setSelectedLayout] = useState(0);
  const [layoutsState, setLayoutsState] = useState([]);
  const [layoutsId, setLayoutsId] = useState([]);

  const maxNameSize = 10;
  const maxSubjectSize = 10;

  const validate = Yup.object({
    deckName: Yup.string().required(t("req_add_name")).max(
      maxNameSize,
      t("deck_name_len_validation_msg", {
        maxNameSize,
      })
    ),

    deckSubject: Yup.string().required(t("req_add_subject")).max(
      maxSubjectSize,
      t("subject_len_validation_msg", {
        maxSubjectSize,
      })
    ),
  });

  useEffect(() => {
    api.get("layouts").then(async (res) => {
      const layouts = await Promise.all(
        res.data.map((item) => {
          return { name: item.name, id: item._id };
        })
      );

      const names = layouts.map((item: any) => {
        return item.name;
      });

      const ids = layouts.map((item: any) => {
        return item.id;
      });

      setLayoutsState(names);
      setLayoutsId(ids);
    });
  }, []);

  async function sendToServer(values) {
    const deckName = values.deckName;
    const deckSubject = values.deckSubject;

    //Get user ID from jwt token
    const userId = verifyToken();

    //if deck id is passed, then update
    if (deckId) {
      api
        .patch(`/decks/${deckId}`, {
          name: deckName,
          subject: deckSubject,
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
          creator: userId,
          subject: deckSubject,
          layout: layoutsId[selectedLayout],
        })
        .then((res) => {
          const recentlyCreatedId = res.data._id;

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
                      {t("insert_deck_info")}
                    </Dialog.Title>
                    <Formik
                      initialValues={{
                        deckName: "",
                        deckSubject: "",
                      }}
                      validationSchema={validate}
                      onSubmit={(values) => sendToServer(values)}
                    >
                      {(formik) => (
                        <Form className="w-full space-y-8">
                          <div className="flex flex-col items-center justify-center">
                            <label className="font-normal text-xl">
                              {t("layout")}
                            </label>
                            <Select
                              selectedItem={selectedLayout}
                              setSelectedItem={setSelectedLayout}
                              items={layoutsState}
                              className="flex w-full justify-center my-6 sm:px-6"
                              className2="px-8 sm:px-20 font-bold bg-white py-2 text-xl w-full focus:outline-none
                                          focus:shadow-outline-blue focus:border-blue-300 relative border shadow-sm
                                          border-gray-300 rounded text-gray-800"
                            />
                          </div>
                          <TextField
                            label={t("name")}
                            type="text"
                            innerref={deckNameFieldRef}
                            name="deckName"
                            className="bg-gray-100 border-2 border-gray-200 rounded-lg w-full outline-none focus:border-black p-2"
                          />

                          <TextField
                            label={t("subject")}
                            type="text"
                            name="deckSubject"
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
                              {t("confirm")}
                            </button>
                            <button
                              className="confirmation-button px-2 sm:px-16"
                              ref={completeButtonRef}
                              onClick={setShow}
                              type="button"
                            >
                              {t("cancel")}
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

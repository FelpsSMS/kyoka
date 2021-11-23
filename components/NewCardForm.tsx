import { Formik, Form } from "formik";
import { TextField } from "./TextField";
import { TextArea } from "./TextArea";
import React, { useEffect, useMemo, useState } from "react";
import ImageDropzone from "./ImageDropzone";
import AudioDropzone from "./AudioDropzone";
import { useTranslation } from "next-i18next";

import { api, verifyToken } from "../utils/api";
import router, { useRouter } from "next/router";
import { useValidator } from "../utils/customHooks";

export const NewCardForm = ({ deckId }) => {
  const [fields, setFields] = useState([]);
  const [initialVal, setInitialVal] = useState({});

  const [needValidation, setNeedValidation] = useState([]);

  const [initValues, setInitValues] = useState(false);

  const { t } = useTranslation();

  const router = useRouter();

  const { locale } = router;

  const numberOfImages = useMemo(() => {
    return Array.from(Array(4).keys());
  }, []); //4 images

  useEffect(() => {
    let init = {};
    const waitingForValidation = [];

    api.get(`decks/${deckId}`).then((res) => {
      const layout = res.data.layout;

      api
        .post("layout-configs/by-layout", {
          id: layout,
        })
        .then((res) => {
          setFields(res.data);

          res.data.map((item) => {
            const currentField = item.fieldName;
            const holder = currentField + "Holder";

            if (item.required) {
              waitingForValidation.push(item);
            }

            switch (item.fieldType) {
              case 0:
              case 1:
                init[currentField] = "";
                break;

              case 2:
                init[currentField] = "";
                init[holder] = "";
                break;

              case 3:
                numberOfImages.map((item2) => {
                  init[currentField + item2.toString()] = "";
                  init[holder + item2.toString()] = "";
                });
                break;
            }
          });

          setNeedValidation(waitingForValidation);

          setInitialVal(init);

          setInitValues(true);
        });
    });
  }, [deckId, numberOfImages]);

  function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  }

  function sendToServer(values) {
    //Get user ID from jwt token
    const userId = verifyToken();

    let imageData = [];
    let audioData = [];

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    let fd = new FormData();

    Object.entries(values).map((item: any) => {
      if (typeof item[1] === "object") {
        const newFile = renameFile(item[1], item[0]);

        if (item[1].type.split("/")[0] == "image") {
          imageData.push(newFile);
        } else if (item[1].type.split("/")[0] == "audio") {
          audioData.push(newFile);
        }
      } else if (item[1].length > 0) {
        fd.append(item[0], item[1]);
      }
    });

    imageData.map((item) => {
      fd.append("images", item);
    });

    audioData.map((item) => {
      fd.append("audios", item);
    });

    fd.append("deck", deckId);
    fd.append("creator", userId);

    api
      .post(`cards/`, fd, config)
      .then((res) => {
        //Get card ID
        const cardId = res.data._id;

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

  const validate = useValidator(needValidation);

  return (
    <>
      {initValues && (
        <Formik
          initialValues={initialVal}
          validationSchema={validate}
          enableReinitialize
          onSubmit={(values) => sendToServer(values)}
        >
          {(formik) => (
            <Form
              className="bg-white flex flex-col justify-center items-center sm:my-8 space-y-8 w-full
              sm:shadow-lg sm:rounded-lg sm:w-4/5 sm:items-start sm:justify-start p-4
              whitespace-nowrap"
            >
              <h1 className="font-black text-3xl sm:text-5xl">
                {t("register_card")}
              </h1>

              <div className="flex flex-col w-full space-y-4">
                {fields.map((item, i) => {
                  const currentFieldName = item.fieldName;

                  const itemLabel = item.fieldLabel[0];

                  switch (item.fieldType) {
                    case 0:
                      return (
                        <TextField
                          key={i}
                          label={itemLabel[locale]}
                          name={currentFieldName}
                          type="text"
                        />
                      );

                    case 1:
                      return (
                        <TextArea
                          key={i}
                          label={itemLabel[locale]}
                          name={currentFieldName}
                          type="text"
                        />
                      );

                    case 2:
                      return (
                        <div key={i}>
                          <AudioDropzone
                            label={itemLabel[locale]}
                            name={currentFieldName + "Holder"}
                            fileExchange={(audio) => {
                              formik.setFieldValue(currentFieldName, audio);
                            }}
                          />

                          <input name={currentFieldName} hidden />
                        </div>
                      );

                    case 3:
                      return (
                        <div className="flex flex-col space-y-2" key={i}>
                          <label className="text-xl font-normal">
                            {itemLabel[locale]}
                          </label>
                          <div className="flex flex-wrap flex-col space-y-4 xs:space-x-4 xs:space-y-0 xs:flex-row">
                            <div className="flex space-x-4 xs:space-x-4">
                              {numberOfImages.map((item, j) => {
                                return (
                                  <div key={j * 10}>
                                    <ImageDropzone
                                      name={
                                        currentFieldName +
                                        "Holder" +
                                        item.toString()
                                      }
                                      fileExchange={(image) => {
                                        formik.setFieldValue(
                                          currentFieldName + item.toString(),
                                          image
                                        );
                                      }}
                                    />

                                    <input
                                      name={currentFieldName + item.toString()}
                                      hidden
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                  }
                })}
              </div>

              <button className="confirmation-button" type="submit">
                {t("create")}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

import { Formik, Form } from "formik";
import { TextField } from "./TextField";
import * as Yup from "yup";
import { TextArea } from "./TextArea";
import React, { useEffect, useState } from "react";
import ImageDropzone from "./ImageDropzone";
import AudioDropzone from "./AudioDropzone";

import { api, verifyToken } from "../utils/api";
import router from "next/router";

export const NewCardForm = ({ deckId }) => {
  const [fields, setFields] = useState([]);
  const [initialVal, setInitialVal] = useState({});

  const [needValidation, setNeedValidation] = useState([]);

  const [initValues, setInitValues] = useState(false);
  const numberOfImages = Array.from(Array(4).keys()); //4 images

  let init = {};

  useEffect(() => {
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
              setNeedValidation([...needValidation, item]);
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

            setInitialVal(init);

            console.log(init);
            setInitValues(true);
          });
        });
    });
  }, []);

  function createValidator() {
    const validationObject: { [key: string]: Yup.StringSchema } = {};

    needValidation.forEach((item) => {
      console.log("ue");
      console.log(item.fieldName);

      validationObject[item.fieldName] = Yup.string().required(
        "Este campo é obrigatório"
      );
    });
    console.log(validationObject);

    return Yup.object(validationObject);
  }

  function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  }

  const validate = createValidator();

  function sendToServer(values) {
    //Get user ID from jwt token
    const userId = verifyToken();

    let imageData = [];
    let audioData = [];

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    let fd = new FormData();

    console.log(values);

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
      console.log(item);
      fd.append("images", item);
    });

    audioData.map((item) => {
      console.log(item);

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
                Registrar carta
              </h1>

              <div className="flex flex-col w-full space-y-4">
                {fields.map((item, i) => {
                  const currentFieldName = item.fieldName;
                  const labelNumber = 0;

                  switch (item.fieldType) {
                    case 0:
                      return (
                        <TextField
                          key={i}
                          label={item.fieldLabel[labelNumber]}
                          name={currentFieldName}
                          type="text"
                        />
                      );

                    case 1:
                      return (
                        <TextArea
                          key={i}
                          label={item.fieldLabel[labelNumber]}
                          name={currentFieldName}
                          type="text"
                        />
                      );

                    case 2:
                      return (
                        <div key={i}>
                          <AudioDropzone
                            label={item.fieldLabel[labelNumber]}
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
                        <>
                          <label className="text-xl font-normal">
                            {item.fieldLabel[labelNumber]}
                          </label>
                          <div
                            className="flex flex-wrap flex-col space-y-4 xs:space-x-4 xs:space-y-0 xs:flex-row"
                            key={i}
                          >
                            <div className="flex space-x-4 xs:space-x-4">
                              {numberOfImages.map((item) => {
                                return (
                                  <div key={item}>
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
                        </>
                      );
                  }
                })}
              </div>

              <button className="confirmation-button" type="submit">
                Criar
              </button>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

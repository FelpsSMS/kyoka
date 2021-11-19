import { Formik, Form } from "formik";
import { TextField } from "./TextField";
import { TextArea } from "./TextArea";
import React, { useEffect, useMemo, useState } from "react";
import ImageDropzone from "./ImageDropzone";
import AudioDropzone from "./AudioDropzone";

import { api } from "../utils/api";

import router from "next/router";
import { useValidator } from "../utils/customHooks";
import DeletePrompt from "./modals/DeletePrompt";

export const CardInfoUpdateForm = ({ cardDetails: card, readOnly }) => {
  const [fields, setFields] = useState([]);
  const [initialVal, setInitialVal] = useState({});

  const [needValidation, setNeedValidation] = useState([]);

  const [initValues, setInitValues] = useState(false);

  const numberOfImages = useMemo(() => {
    return Array.from(Array(4).keys());
  }, []); //4 images

  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  useEffect(() => {
    let init = {};
    api.get(`decks/${card.deckId}`).then((res) => {
      const layout = res.data.layout;

      api
        .post("layout-configs/by-layout", {
          id: layout,
        })
        .then((res) => {
          setFields(res.data);
          const waitingForValidation = [];

          res.data.map((item) => {
            const currentField = item.fieldName;
            const holder = currentField + "Holder";
            const currentValue = card.layoutInfo[currentField];

            if (item.required) {
              waitingForValidation.push(item);
            }

            switch (item.fieldType) {
              case 0:
              case 1:
                init[currentField] = currentValue ?? "";
                break;

              case 2:
                init[currentField] = currentValue ?? "";

                init[holder] = currentValue ?? "";
                break;

              case 3:
                numberOfImages.map((number) => {
                  const currentValueIndexed = currentValue
                    ? currentValue[number] ?? ""
                    : "";

                  const currentValueIndexedUrl = currentValueIndexed.url ?? "";

                  init[currentField + number.toString()] = init[
                    holder + number.toString()
                  ] = currentValueIndexedUrl ?? "";

                  init[holder + number.toString()] =
                    currentValueIndexedUrl ?? "";
                });

                break;
            }

            setInitialVal(init);
          });

          setNeedValidation(waitingForValidation);
        })
        .then(() => {
          setInitValues(true);
        });
    });
  }, [card.deckId, card.layoutInfo, numberOfImages]);

  function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  }

  const validate = useValidator(needValidation);

  function sendToServer(values) {
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
      } else if (item[1].length > 0 && !item[0].includes("Holder")) {
        fd.append(item[0], item[1]);
      }
    });

    imageData.map((item) => {
      fd.append("images", item);
    });

    audioData.map((item) => {
      fd.append("audios", item);
    });

    api
      .patch(`cards/${card.id}`, fd, config)

      .then(() => router.back()) //redirect user to the deck page

      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      {initValues && (
        <div>
          <DeletePrompt
            show={showDeletePrompt}
            setShow={() => setShowDeletePrompt(false)}
            id={card.id}
            routeName={"cards"}
            title="Você realmente deseja excluir esta carta?"
          />
          <Formik
            initialValues={initialVal}
            validationSchema={validate}
            enableReinitialize
            onSubmit={(values) => sendToServer(values)}
          >
            {(formik) => (
              <Form className="flex flex-col flex-wrap m-4">
                <div className="flex flex-col w-full space-y-4">
                  {fields.map((item, i) => {
                    const currentFieldName = item.fieldName;
                    const labelNumber = 0;
                    const label = item.fieldLabel;
                    const currentValue = card.layoutInfo[currentFieldName];

                    switch (item.fieldType) {
                      case 0:
                        return (
                          <TextField
                            key={i}
                            label={label[labelNumber]}
                            name={currentFieldName}
                            type="text"
                            readOnly={readOnly}
                          />
                        );

                      case 1:
                        return (
                          <TextArea
                            key={i}
                            label={label[labelNumber]}
                            name={currentFieldName}
                            type="text"
                            readOnly={readOnly}
                          />
                        );

                      case 2:
                        return (
                          <div key={i}>
                            <AudioDropzone
                              label={label[labelNumber]}
                              name={currentFieldName + "Holder"}
                              fileExchange={(audio) => {
                                formik.setFieldValue(currentFieldName, audio);
                              }}
                              webSource={currentValue ?? ""}
                              readOnly={readOnly}
                            />

                            <input name={currentFieldName} hidden />
                          </div>
                        );

                      case 3:
                        return (
                          <div className="flex flex-col space-y-2" key={i}>
                            <label className="text-xl font-normal">
                              {label[labelNumber]}
                            </label>
                            <div className="flex flex-wrap flex-col space-y-4 xs:space-x-4 xs:space-y-0 xs:flex-row">
                              <div className="flex space-x-4 xs:space-x-4">
                                {numberOfImages.map((number, j) => {
                                  const currentValueIndexed = currentValue
                                    ? currentValue[number] ?? ""
                                    : "";
                                  const currentValueIndexedUrl =
                                    currentValueIndexed.url ?? "";

                                  return (
                                    <div key={j * 10}>
                                      <ImageDropzone
                                        name={
                                          currentFieldName +
                                          "Holder" +
                                          number.toString()
                                        }
                                        fileExchange={(image) => {
                                          formik.setFieldValue(
                                            currentFieldName +
                                              number.toString(),
                                            image
                                          );
                                        }}
                                        webSource={currentValueIndexedUrl ?? ""}
                                        readOnly={readOnly}
                                      />

                                      <input
                                        name={
                                          currentFieldName + item.toString()
                                        }
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
            )}
          </Formik>
        </div>
      )}
    </>
  );
};

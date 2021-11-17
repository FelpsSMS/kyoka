import { Formik, Form } from "formik";
import { TextField } from "./TextField";
import * as Yup from "yup";
import { TextArea } from "./TextArea";
import React, { useEffect, useLayoutEffect, useState } from "react";
import ImageDropzone from "./ImageDropzone";
import AudioDropzone from "./AudioDropzone";
import axios from "axios";
import { api, verifyToken } from "../utils/api";
import router from "next/router";

export const NewCardForm = ({ deckId }) => {
  const [fields, setFields] = useState([]);
  const [initialVal, setInitialVal] = useState([]);
  // const [currentFieldName, setCurrentFieldName] = useState("");
  let fieldData = [];

  const [initValues, setInitValues] = useState(false);
  const numberOfImages = Array.from(Array(4).keys()); //4 images

  let labels = [];
  let init = [];

  labels["sentence"] = "Frase";
  labels["focus"] = "Foco";
  labels["bilingualDescription"] = "Descrição bilíngue";
  labels["monolingualDescription"] = "Descrição monolíngue";
  labels["translation"] = "Tradução";
  labels["notes"] = "Observações";
  labels["sentenceAudio"] = "Áudio da frase";
  labels["focusAudio"] = "Áudio do foco";
  labels["images"] = "Imagens";

  /*   fileHolders["sentenceAudio"];
  fileHolders["focusAudio"]; */

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

            switch (item.fieldType) {
              case 0:
              case 1:
                init[currentField] = ""; //init[currentField] = "hm";
                break;

              case 2:
                init[currentField] = "";
                //init[holder] = { name: "" };
                break;

              case 3:
                numberOfImages.map((item2) => {
                  init[currentField + item2.toString()] = "";
                  //init[holder + item2.toString()] = { name: "" };
                });
                break;
            }

            setInitialVal(init);
            setInitValues(true);
          });
        });
    });
  }, []);

  const validate = Yup.object({
    focus: Yup.string().required(
      "Por favor, adicione um foco. Isso pode ser uma palavra ou expressão"
    ),
  });

  function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  }

  function sendToServer() {
    //Get user ID from jwt token
    const userId = verifyToken();

    let imageData = [];
    let audioData = [];

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    let fd = new FormData();

    Object.entries(fieldData).map((item) => {
      /*       console.log(item[0]);
      console.log(typeof item[1]); */

      if (item[0].length > 0) {
        if (typeof item[1] === "object") {
          const newFile = renameFile(item[1], item[0]);

          if (item[1].type.split("/")[0] == "image") {
            imageData.push(newFile);
          } else if (item[1].type.split("/")[0] == "audio") {
            audioData.push(newFile);
          }
        } else {
          fd.append(item[0], item[1]);
        }
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
        console.log(res.data);
      })
      /*   .then((res) => {
        //Get card ID
        const cardId = res.data._id;

        //Create SRS stats for the card
        api
          .post("/card-stats", {
            card: cardId,
            user: userId,
          })
          .then(() => router.back()); //redirect user to the deck page
      }) */
      .catch((err) => {
        console.log(err);
      });

    /*  const lastChar = item[0].slice(-1);
        const isNotNumber = isNaN(parseInt(lastChar));

        if (isNotNumber) {
          fd.append(item[0], item[1]);
        } else {
          if (!arrayFieldData[item[0].slice(0, -1)]) {
            arrayFieldData[item[0].slice(0, -1)] = [];
          }

          arrayFieldData[item[0].slice(0, -1)].push(item[1]);
        } */

    //console.log(audioHolders);
    //console.log(imageHolders);
    /*     if (values.sentenceAudioHolder.name !== "") {
      files["sentenceAudio"] = values.sentenceAudioHolder;
    }

    if (values.focusAudioHolder.name !== "") {
      files["focusAudio"] = values.focusAudioHolder;
    } */

    /*     const images = [
      values.image1Holder,
      values.image2Holder,
      values.image3Holder,
      values.image4Holder,
    ];

    files["images"] = images.filter((image) => {
      return image !== "";
    });
 */

    /*     files["images"].map((image) => {
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
 */
    //fd.append("creator", userId);

    /* api
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
      }); */
  }

  return (
    <>
      {initValues && (
        <Formik
          initialValues={initialVal}
          validationSchema={validate}
          enableReinitialize
          onSubmit={() => sendToServer()}
        >
          <Form
            className="bg-white flex flex-col justify-center items-center sm:my-8 space-y-8 w-full
        sm:shadow-lg sm:rounded-lg sm:w-4/5 sm:items-start sm:justify-start p-4
        whitespace-nowrap"
            onChange={(e: any) => {
              fieldData[e.target.name] = e.target.value;
            }}
          >
            <h1 className="font-black text-3xl sm:text-5xl">Registrar carta</h1>

            <div className="flex flex-col w-full space-y-4">
              {fields.map((item, i) => {
                const currentFieldName = item.fieldName;
                switch (item.fieldType) {
                  case 0:
                    return (
                      <TextField
                        key={i}
                        label={labels[currentFieldName]}
                        name={currentFieldName}
                        type="text"
                      />
                    );

                  case 1:
                    return (
                      <TextArea
                        key={i}
                        label={labels[currentFieldName]}
                        name={currentFieldName}
                        type="text"
                      />
                    );

                  case 2:
                    return (
                      <div key={i}>
                        <AudioDropzone
                          label={labels[currentFieldName]}
                          name={currentFieldName}
                          fileExchange={(audio) => {
                            /*         formik.setFieldValue(
                                currentFieldName + "Holder",
                                audio
                              ); */

                            fieldData[currentFieldName] = audio;
                          }}
                        />

                        {/* <input name={currentFieldName + "Holder"} hidden /> */}
                      </div>
                    );

                  case 3:
                    return (
                      <div
                        className="flex flex-wrap flex-col space-y-4 xs:space-x-4 xs:space-y-0 xs:flex-row"
                        key={i}
                      >
                        <div className="flex space-x-4 xs:space-x-4">
                          {numberOfImages.map((item) => {
                            return (
                              <div key={item}>
                                <ImageDropzone
                                  name={currentFieldName + item.toString()}
                                  fileExchange={(image) => {
                                    /*formik.setFieldValue(
                                        currentFieldName +
                                          "Holder" +
                                          item.toString(),
                                        image
                                      ); */

                                    fieldData[
                                      currentFieldName + item.toString()
                                    ] = image;
                                  }}
                                />

                                {/* <input
                                    name={
                                      currentFieldName +
                                      "Holder" +
                                      item.toString()
                                    }
                                    hidden
                                  /> */}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                }
              })}

              {/*  <TextField label="Frase" name="sentence" type="text" />
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

            <TextArea label="Observações" name="notes" type="text" /> */}
            </div>

            <button className="confirmation-button" type="submit">
              Criar
            </button>
          </Form>
        </Formik>
      )}
    </>
  );
};

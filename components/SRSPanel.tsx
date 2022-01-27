import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, verifyToken } from "../utils/api";
import Image from "next/image";
import ToggleBox from "./ToggleBox";
import PlayAudioButton from "./PlayAudioButton";
import LoadingWheel from "./LoadingWheel";
import Heatmap from "./Heatmap";
import { dayInMilliseconds } from "../utils/constants";
import { nanoid } from "nanoid";
import ImagePopup from "./modals/ImagePopup";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export default function SRSPanel() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [src, setSRC] = useState("");
  const router = useRouter();

  const { locale } = router;

  const imageLoader = ({ src }) => {
    return src;
  };

  const [newCardsNumber, setNewCardsNumber] = useState(0);
  const [reviewedCardsNumber, setReviewedCardsNumber] = useState(0);
  const [relearnedCardsNumber, setRelearnedCardsNumber] = useState(0);

  const [cardsToBeShowed, setCardsToBeShowed] = useState([]);

  const [reloadCards, setReloadCards] = useState(false);

  const [sessionStart, setSessionStart] = useState(false);

  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [sessionId, setSessionId] = useState("");

  const [lapseThreshold, setLapseThreshold] = useState(8);

  function addLapse(id, totalLapses, consecutiveLapses) {
    api
      .patch(`card-stats/${id}`, {
        totalLapses: totalLapses + 1,
        consecutiveLapses: consecutiveLapses + 1,
      })
      .then((res) => {
        if (res.data.consecutiveLapses >= lapseThreshold) {
          api.patch(`card-stats/${id}`, {
            leech: true,
          });
        }
      });
  }

  function addFail(id, failCount) {
    api.patch(`card-stats/${id}`, {
      failCount: failCount + 1,
    });
  }

  function addPass(id, passCount) {
    api.patch(`card-stats/${id}`, {
      passCount: passCount + 1,
    });
  }

  function removeConsecutiveLapses(id) {
    api.patch(`card-stats/${id}`, {
      consecutiveLapses: 0,
    });
  }

  async function calculateInterval(repetitions, efactor, dueDate, pass, _id) {
    await api
      .post("card-stats/srs", {
        repetitions: repetitions,
        efactor: efactor,
        dueDate: dueDate,
        pass: pass,
        statId: _id,
      })
      .then(async (res) => {
        const interval = res.data.dueDate - Date.now();

        if (interval > dayInMilliseconds * 21) {
          await api.patch(`card-stats/${res.data._id}`, {
            mature: true,
          });
        }

        setReloadCards(!reloadCards);
        setIsDataLoaded(false);
      });
  }

  async function changeState(id, state) {
    await api
      .patch(`card-stats/${id}`, {
        state: state,
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  }

  function showImage(item) {
    setSRC(item);
    setShow(true);
  }

  async function checkSRS(cardStats, pass) {
    const {
      state,
      repetitions,
      efactor,
      dueDate,
      _id,
      totalLapses,
      consecutiveLapses,
      failCount,
      passCount,
    } = cardStats;

    if (state == 0) {
      await changeState(_id, 1); //if the card is new, change state from new to learning

      await calculateInterval(repetitions, efactor, dueDate, pass, _id);
    }

    if (pass) {
      addPass(_id, passCount);

      switch (state) {
        case 1:
          await changeState(_id, 3); //if the card is in the learning state, change state to reviewing

          await calculateInterval(repetitions, efactor, dueDate, pass, _id);

          break;

        case 2:
          await changeState(_id, 3); //if the card is in the relearning state, change state to reviewing and remove consecutive lapses

          removeConsecutiveLapses(_id);

          await calculateInterval(repetitions, efactor, dueDate, pass, _id);

          break;

        case 3:
          //if the card is in the reviewing state, calculate the interval for the next review and proceed
          await calculateInterval(repetitions, efactor, dueDate, pass, _id);

          break;
      }
    } else {
      addFail(_id, failCount);

      switch (state) {
        case 1:
        case 2:
          //if the user fails the card in the learning or relearning state, just send it to the end of the list
          await calculateInterval(repetitions, efactor, dueDate, pass, _id);

          break;

        case 3:
          //if the user fails the card in the reviewing state, add a lapse and change it's state to relearning
          await changeState(_id, 3);

          addLapse(_id, totalLapses, consecutiveLapses);

          await calculateInterval(repetitions, efactor, dueDate, pass, _id);

          break;
      }
    }
  }

  async function parseSRSResponse(cardInfo, pass) {
    const { cardStats } = cardInfo;

    //get session
    const session = await api.get(`sessions/${sessionId}`);

    const sessionInfo = session.data;

    //set session data
    let failedOnMatureCard = 0;
    let isMature = 0;
    let isNew = 0;

    if (cardStats.state === 0) {
      isNew = 1;
    }

    if (cardStats.mature) {
      failedOnMatureCard = 1;
      isMature = 1;
    }

    api.patch(`sessions/${sessionId}`, {
      endTime: Date.now(),
      numberOfCardsReviewed: sessionInfo.numberOfCardsReviewed + 1,
      numberOfFailsOnMatureCards:
        sessionInfo.numberOfFailsOnMatureCards + failedOnMatureCard,
      numberOfMatureCardsReviewed:
        sessionInfo.numberOfMatureCardsReviewed + isMature,
      numberOfNewCardsReviewed: sessionInfo.numberOfNewCardsReviewed + isNew,
    });

    await checkSRS(cardStats, pass).then(() => {
      if (isDataLoaded) setIsCardFlipped(false);
    });
  }

  useEffect(() => {
    //get active decks for the specific user
    const userId = verifyToken();

    const millisecondsInDay = 60 * 60 * 24 * 1000;

    function getDiffInDays(a, b) {
      // a and b are javascript Date objects
      // Discard the time and time-zone information.
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

      return Math.abs(Math.floor((utc2 - utc1) / millisecondsInDay));
    }

    api
      .post("deck-stats/user", {
        userId: userId,
      })
      .then(async (res) => {
        const data = res.data;

        const decks = await Promise.all(
          data.map(async (item) => {
            const deck = await api.get(`decks/${item.deck}`).then((res) => {
              return res.data;
            });

            return { deck: deck, active: item.active };
            // eslint-disable-next-line react-hooks/exhaustive-deps
          })
        );

        const activeDecks = decks.filter((item: any) => item.active === true);

        //get all cards and stats for these decks
        const cardArrayList = await Promise.all(
          activeDecks.map(async (item: any) => {
            const cardData = await api
              .get(`cards/get_cards/${item.deck._id}`)
              .then(async (res) => {
                const cardInfo = res.data;

                const fieldData = await api
                  .get(`decks/${item.deck._id}`)
                  .then(async (res) => {
                    const layout = res.data.layout;
                    const response = await api
                      .post("layout-configs/by-layout", {
                        id: layout,
                      })
                      .then((res) => {
                        return res.data;
                      });

                    return response;
                  });

                //sort field data
                cardInfo.map((card) => {
                  const auxFieldData = Object.keys(card.layoutInfo[0]);

                  const filteredFieldData = fieldData.filter((item) => {
                    return auxFieldData.includes(item.fieldName);
                  });

                  const newFieldData = [];

                  const fieldType0 = filteredFieldData.filter(
                    (item) => item.fieldType === 0
                  );

                  const fieldType1 = filteredFieldData.filter(
                    (item) => item.fieldType === 1
                  );

                  const fieldType2 = filteredFieldData.filter(
                    (item) => item.fieldType === 2
                  );

                  const fieldType3 = filteredFieldData.filter(
                    (item) => item.fieldType === 3
                  );

                  fieldType3.map((item) => {
                    newFieldData.push(item);
                  });

                  fieldType0.map((item) => {
                    newFieldData.push(item);
                  });

                  fieldType1.map((item) => {
                    newFieldData.push(item);
                  });

                  fieldType2.map((item) => {
                    newFieldData.push(item);
                  });

                  const frontData = newFieldData.filter(
                    (item) => item.front && item.fieldName != "focus"
                  );

                  card["frontData"] = frontData;

                  card["fieldData"] = newFieldData;
                });

                return cardInfo;
              });

            return cardData;
          })
        );

        //group them into a single list
        const cardList = cardArrayList.reduce(
          (a: any, b: any) => a.concat(b),
          []
        );

        //grab info relevant for the srs and group it with the list
        const cardData: any = await Promise.all(
          cardList.map(async (item) => {
            const cardStats = await api
              .post(`card-stats/card`, {
                cardId: item._id,
                userId: userId,
              })
              .then((res) => {
                return res.data;
              });

            return { cardStats: cardStats, card: item };
          })
        );

        //get user info
        const userInfo = await api
          .post(`users/user-info`, {
            id: userId,
          })
          .then((res) => {
            return res.data;
          });

        //check if the user wishes to remove removeLeeches and lapse threshold
        setLapseThreshold(userInfo.lapseThreshold);

        //get all cards with each state

        //state 0 (not yet added to the SRS)
        const queuedCards = cardData.filter(
          (item: any) => item.cardStats.state === 0
        );

        let cardDataForTheDay = cardData.filter((item: any) => {
          const dueDay = new Date(item.cardStats.dueDate).getDate();
          const currentDay = new Date().getDate();

          return dueDay <= currentDay;
        });

        //if the user wishes to, remove leeches
        if (userInfo.removeLeeches) {
          cardDataForTheDay = cardDataForTheDay.filter(
            (item) => item.cardStats.leech === false
          );
        }

        //for the other states, grab only the cards due for the day

        //state 1
        const cardsBeingLearned = cardDataForTheDay.filter(
          (item: any) => item.cardStats.state === 1
        );

        //state 2
        const cardsBeingRelearned = cardDataForTheDay.filter(
          (item: any) => item.cardStats.state === 2
        );

        //state 3
        const cardsBeingReviewed = cardDataForTheDay.filter(
          (item: any) => item.cardStats.state === 3
        );

        //relevant sessions for the day
        const sessionsData = await api
          .post("sessions/user-sessions", {
            userId,
          })
          .then((res) => {
            const sessions = res.data;

            return sessions.map((session) => {
              const currentDay = new Date();

              const diffInDays = getDiffInDays(
                currentDay,
                new Date(session.endTime)
              );

              if (diffInDays === 0) return session;
            });
          });

        console.log(sessionsData);

        const newCardsDone = sessionsData.reduce((acc, session) => {
          if (session) return acc + session.numberOfNewCardsReviewed;

          return acc;
        }, 0);

        console.log(newCardsDone);

        //sort cards with state 0 from oldest to newest
        const sortedQueuedCards = queuedCards.sort((a: any, b: any) => {
          return a.cardStats.dueDate - b.cardStats.dueDate;
        });

        //add new cards to the SRS up to a limit set by the user
        const cardsToBeAdded = sortedQueuedCards.slice(
          0,
          userInfo.numberOfNewCards - newCardsDone
        );

        setCardsToBeShowed(
          [
            ...cardsToBeAdded,
            ...cardsBeingReviewed,
            ...cardsBeingLearned,
            ...cardsBeingRelearned,
          ].sort(() => Math.random() - 0.5) //shuffle the list a bit
        );

        setNewCardsNumber(cardsToBeAdded.length);

        const totalReviewedCards =
          cardsBeingLearned.length + cardsBeingReviewed.length;

        setReviewedCardsNumber(totalReviewedCards);
        setRelearnedCardsNumber(cardsBeingRelearned.length);

        setIsPageLoaded(true);

        setIsDataLoaded(true);
      });

    return () => {};
  }, [reloadCards]);

  const getTotalCardsNumber = useCallback(() => {
    return newCardsNumber + reviewedCardsNumber + relearnedCardsNumber;
  }, [newCardsNumber, relearnedCardsNumber, reviewedCardsNumber]);

  useEffect(() => {
    const userId = verifyToken();

    if (sessionStart && !sessionId) {
      //start new session

      api
        .post("sessions", {
          user: userId,
          numberOfCardsToReview: getTotalCardsNumber(),
        })
        .then((res) => {
          setSessionId(res.data._id);
        });
    }
  }, [sessionStart, sessionId, getTotalCardsNumber]);

  return (
    <motion.div
      className="bg-white flex flex-col min-h-screen w-screen items-center justify-center sm:rounded-lg 
      sm:shadow-lg sm:my-8 sm:mx-8 md:mx-16 lg:my-16 lg:mx-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ImagePopup show={show} setShow={() => setShow(false)} src={src} />
      {sessionStart && isPageLoaded ? (
        isCardFlipped && isDataLoaded ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            {cardsToBeShowed[0].card.fieldData.map((field) => {
              const itemLabel = field.fieldLabel[0];

              switch (field.fieldType) {
                case 0:
                case 1:
                  if (field.front) {
                    if (field.fieldName == "focus") {
                      return (
                        <p
                          className="text-4xl sm:text-4xl font-bol p-4"
                          key={nanoid()}
                        >
                          {cardsToBeShowed[0].card.layoutInfo[0]
                            ? cardsToBeShowed[0].card.layoutInfo[0][
                                field.fieldName
                              ]
                            : setSessionStart(false)}
                        </p>
                      );
                    } else {
                      return (
                        <p
                          className="text-6xl sm:text-7xl font-bol p-4"
                          key={nanoid()}
                        >
                          {cardsToBeShowed[0].card.layoutInfo[0]
                            ? cardsToBeShowed[0].card.layoutInfo[0][
                                field.fieldName
                              ]
                            : setSessionStart(false)}
                        </p>
                      );
                    }
                  } else {
                    return (
                      <div key={nanoid()}>
                        {cardsToBeShowed[0].card.layoutInfo[0][
                          field.fieldName
                        ] && (
                          <ToggleBox
                            title={itemLabel[locale]}
                            text={
                              cardsToBeShowed[0].card.layoutInfo[0][
                                field.fieldName
                              ]
                            }
                            key={nanoid()}
                          />
                        )}
                      </div>
                    );
                  }

                case 2:
                  return (
                    <PlayAudioButton
                      key={nanoid()}
                      audio={
                        cardsToBeShowed[0].card.layoutInfo[0][field.fieldName]
                      }
                      width={"3em"}
                      height={"3em"}
                    />
                  );

                case 3:
                  return (
                    <div className="flex" key={nanoid()}>
                      {cardsToBeShowed[0].card.layoutInfo[0][
                        field.fieldName
                      ][0] && (
                        <div
                          className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2 2xl:space-x-4"
                          key={nanoid()}
                        >
                          {cardsToBeShowed[0].card.layoutInfo[0][
                            field.fieldName
                          ].map((item) => {
                            return (
                              <div
                                className="w-16 h-16 sm:w-32 sm:h-32 2xl:w-48 2xl:h-48 scale-105 rounded-lg 
                                hover:cursor-pointer hover:scale-110 relative"
                                key={nanoid()}
                              >
                                <Image
                                  loader={imageLoader}
                                  src={item.url}
                                  alt="Uploaded image"
                                  layout="fill"
                                  objectFit="contain"
                                  unoptimized={true}
                                  onClick={() => {
                                    showImage(item);
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
              }
            })}

            <div className="flex space-x-2 p-4">
              <button
                className="confirmation-button"
                onClick={() => parseSRSResponse(cardsToBeShowed[0], true)}
              >
                {t("pass")}
              </button>
              <button
                className="confirmation-button"
                onClick={() => parseSRSResponse(cardsToBeShowed[0], false)}
              >
                {t("fail")}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-48">
            <div>
              {isDataLoaded ? (
                cardsToBeShowed[0] ? (
                  cardsToBeShowed[0].card.frontData.length > 0 ? (
                    cardsToBeShowed[0].card.frontData.map((item) => {
                      return (
                        <p className="text-5xl font-bold" key={nanoid()}>
                          {
                            cardsToBeShowed[0].card.layoutInfo[0][
                              item.fieldName
                            ]
                          }
                        </p>
                      );
                    })
                  ) : (
                    <p className="text-5xl font-bold" key={nanoid()}>
                      {cardsToBeShowed[0].card.layoutInfo[0].focus}
                    </p>
                  )
                ) : (
                  setSessionStart(false)
                )
              ) : (
                <LoadingWheel />
              )}
            </div>
            <div className="flex space-x-2">
              <button
                className="confirmation-button"
                onClick={() => setIsCardFlipped(true)}
              >
                {t("flip_card")}
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col justify-center items-center space-y-2 mx-4">
          <p className="text-3xl font-bol">{t("welcome_msg")}</p>

          <div className="flex flex-col">
            <div className="flex space-x-2">
              <p>{t("new_cards")}</p>
              <p className="text-blue-700">{newCardsNumber}</p>
            </div>

            <div className="flex space-x-2">
              <p>{t("cards_to_review")}</p>
              <p className="text-green-700">{reviewedCardsNumber}</p>
            </div>

            <div className="flex space-x-2">
              <p>{t("cards_to_relearn")}</p>
              <p className="text-red-700">{relearnedCardsNumber}</p>
            </div>
          </div>
          <button
            className="confirmation-button"
            onClick={() => {
              setSessionStart(true);
            }}
          >
            {t("srs_start")}
          </button>
        </div>
      )}

      <Heatmap />
    </motion.div>
  );
}

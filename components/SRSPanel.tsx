import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api, verifyToken } from "../utils/api";
import Image from "next/image";
import ToggleBox from "./ToggleBox";
import PlayAudioButton from "./PlayAudioButton";
import ImagePopup from "./ImagePopup";
import LoadingWheel from "./LoadingWheel";

function SRSPanel() {
  let animationHeight = "";

  const [show, setShow] = useState(false);
  const [src, setSRC] = useState("");

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

  function addLapse(id, totalLapses, consecutiveLapses) {
    api.patch(`card-stats/${id}`, {
      totalLapses: totalLapses + 1,
      consecutiveLapses: consecutiveLapses + 1,
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
      .then(() => {
        setReloadCards(!reloadCards);
        setIsDataLoaded(false);
        console.log("Dentro do calculateInterval");
        //setIsPageLoaded(false);
      });
  }

  async function changeState(id, state) {
    //const newState =
    await api
      .patch(`card-stats/${id}`, {
        state: state,
      })

      .catch((err) => {
        console.log(err);
        return null;
      });

    //return newState.data.state;
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
      //newState =
      await changeState(_id, 1); //if the card is new, change state from new to learning
      //if (newState) cardInfo.cardStats.state = newState; //change the state in the current session

      await calculateInterval(repetitions, efactor, dueDate, pass, _id);
      console.log("Console log after calculateInterval");

      //setNewCardsNumber(newCardsNumber - 1);
      //setReviewedCardsNumber(reviewedCardsNumber + 1);

      //setCardsToBeShowed([...cardsToBeShowed, cardInfo]);
    }

    if (pass) {
      addPass(_id, passCount);

      switch (state) {
        case 1:
          //newState =
          await changeState(_id, 3); //if the card is in the learning state, change state to reviewing
          //if (newState) cardInfo.cardStats.state = newState; //change the state in the current session

          //setCardsToBeShowed([...cardsToBeShowed, cardInfo]);
          await calculateInterval(repetitions, efactor, dueDate, pass, _id);

          break;

        case 2:
          //newState =
          await changeState(_id, 3); //if the card is in the relearning state, change state to reviewing and remove consecutive lapses
          //if (newState) cardInfo.cardStats.state = newState; //change the state in the current session

          removeConsecutiveLapses(_id);

          // setRelearnedCardsNumber(relearnedCardsNumber - 1);
          // setReviewedCardsNumber(reviewedCardsNumber + 1);

          //setCardsToBeShowed([...cardsToBeShowed, cardInfo]);
          await calculateInterval(repetitions, efactor, dueDate, pass, _id);

          break;

        case 3:
          //if the card is in the reviewing state, calculate the interval for the next review and proceed
          await calculateInterval(repetitions, efactor, dueDate, pass, _id);
          //setReviewedCardsNumber(reviewedCardsNumber - 1);

          break;
      }
    } else {
      addFail(_id, failCount);

      switch (state) {
        case 1:
        case 2:
          //if the user fails the card in the learning or relearning state, just send it to the end of the list
          //setCardsToBeShowed([...cardsToBeShowed, cardInfo]);
          await calculateInterval(repetitions, efactor, dueDate, pass, _id);

          break;

        case 3:
          //if the user fails the card in the reviewing state, add a lapse and change it's state to relearning
          //newState =
          await changeState(_id, 3);
          //if (newState) cardInfo.cardStats.state = newState; //change the state in the current session

          addLapse(_id, totalLapses, consecutiveLapses);
          //setCardsToBeShowed([...cardsToBeShowed, cardInfo]);
          await calculateInterval(repetitions, efactor, dueDate, pass, _id);

          break;
      }
    }
  }

  async function parseSRSResponse(cardInfo, pass) {
    const { cardStats } = cardInfo;

    await checkSRS(cardStats, pass).then(() => {
      console.log("checkSRS");
      if (isDataLoaded) setIsCardFlipped(false);
    });
  }

  useEffect(() => {
    animationHeight = window.innerWidth > 640 ? "80%" : "100%"; //640px is the cutoff for sm in tailwind

    //get active decks for the specific user
    const userId = verifyToken();

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
              .then((res) => {
                return res.data;
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
              })
              .then((res) => {
                return res.data[0];
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

        //get all cards with each state

        //state 0 (not yet added to the SRS)
        const queuedCards = cardData.filter(
          (item: any) => item.cardStats.state === 0
        );

        const cardDataForTheDay = cardData.filter((item: any) => {
          const dueDay = new Date(item.cardStats.dueDate).getDate();
          const currentDay = new Date().getDate();

          return dueDay <= currentDay;
        });

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

        //sort cards with state 0 from oldest to newest
        const sortedQueuedCards = queuedCards.sort((a: any, b: any) => {
          return a.cardStats.dueDate - b.cardStats.dueDate;
        });

        //add new cards to the SRS up to a limit set by the user
        const cardsToBeAdded = sortedQueuedCards.slice(
          0,
          userInfo.numberOfCards
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

        console.log("Console log before setting isDataLoaded inside useEffect");
        setIsDataLoaded(true);
      });
  }, [reloadCards]);

  return (
    <motion.div
      className="bg-white flex min-h-screen w-screen items-center justify-center sm:rounded-lg 
      sm:shadow-lg sm:my-8 sm:mx-8 md:mx-16 lg:my-16 lg:mx-32"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: animationHeight, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <ImagePopup show={show} setShow={() => setShow(false)} src={src} />
      {sessionStart && isPageLoaded ? (
        isCardFlipped && isDataLoaded ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex">
              {cardsToBeShowed[0].card.images[0] && (
                <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2 2xl:space-x-4">
                  {cardsToBeShowed[0].card.images.map((item, i) => {
                    return (
                      <div
                        className="w-16 h-16 sm:w-32 sm:h-32 2xl:w-48 2xl:h-48 scale-105 rounded-lg hover:cursor-pointer hover:scale-110"
                        key={i}
                      >
                        <Image
                          loader={imageLoader}
                          src={item}
                          alt="Uploaded image"
                          layout="fill"
                          objectFit="contain"
                          onClick={() => showImage(item)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <p className="text-4xl sm:text-5xl font-bol p-4">
              {cardsToBeShowed[0]
                ? cardsToBeShowed[0].card.sentence
                : setSessionStart(false)}
            </p>

            <p className="text-2xl sm:text-3xl font-bold">
              {cardsToBeShowed[0]
                ? cardsToBeShowed[0].card.focus
                : setSessionStart(false)}
            </p>

            <div className="flex flex-col">
              {cardsToBeShowed[0].card.bilingualDescription && (
                <ToggleBox
                  title={"Descrição bilíngue"}
                  text={cardsToBeShowed[0].card.bilingualDescription}
                />
              )}
              {cardsToBeShowed[0].card.monolingualDescription && (
                <ToggleBox
                  title={"Descrição monolíngue"}
                  text={cardsToBeShowed[0].card.monolingualDescription}
                />
              )}
              {cardsToBeShowed[0].card.translation && (
                <ToggleBox
                  title={"Tradução"}
                  text={cardsToBeShowed[0].card.translation}
                />
              )}
              {cardsToBeShowed[0].card.notes && (
                <ToggleBox
                  title={"Observações"}
                  text={cardsToBeShowed[0].card.notes}
                />
              )}
            </div>
            {cardsToBeShowed[0].card.sentenceAudio[0] && (
              <div className="flex space-x-2">
                {cardsToBeShowed[0].card.sentenceAudio.map((item, i) => {
                  return <PlayAudioButton audio={item} key={i} />;
                })}
                {cardsToBeShowed[0].card.focusAudio[0] &&
                  cardsToBeShowed[0].card.focusAudio.map((item, i) => {
                    return <PlayAudioButton audio={item} key={i} />;
                  })}
              </div>
            )}

            <div className="flex space-x-2 p-4">
              <button
                className="confirmation-button"
                onClick={() => parseSRSResponse(cardsToBeShowed[0], true)}
              >
                Acertei
              </button>
              <button
                className="confirmation-button"
                onClick={() => parseSRSResponse(cardsToBeShowed[0], false)}
              >
                Errei
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-48">
            <p className="text-5xl font-bol">
              {isDataLoaded ? (
                cardsToBeShowed[0] ? (
                  cardsToBeShowed[0].card.sentence ? ( //try to show the sentence, if theres no sentence, show the focus
                    cardsToBeShowed[0].card.sentence
                  ) : (
                    cardsToBeShowed[0].card.focus
                  )
                ) : (
                  setSessionStart(false)
                )
              ) : (
                <LoadingWheel />
              )}
            </p>

            <div className="flex space-x-2">
              <button
                className="confirmation-button"
                onClick={() => setIsCardFlipped(true)}
              >
                Virar carta
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col space-y-2">
          <p className="text-3xl font-bol">Bem-vindo de volta!</p>

          <div className="flex flex-col">
            <div className="flex space-x-2">
              <p>Novas cartas: </p>
              <p className="text-blue-700">{newCardsNumber}</p>
            </div>

            <div className="flex space-x-2">
              <p>Cartas para revisão: </p>
              <p className="text-green-700">{reviewedCardsNumber}</p>
            </div>

            <div className="flex space-x-2">
              <p>Cartas a serem reaprendidas: </p>
              <p className="text-red-700">{relearnedCardsNumber}</p>
            </div>
          </div>
          <button
            className="confirmation-button"
            onClick={() => {
              setSessionStart(true);
            }}
          >
            Começar
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default SRSPanel;

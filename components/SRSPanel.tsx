import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api, verifyToken } from "../utils/api";
import Image from "next/image";
import ToggleBox from "./ToggleBox";
import PlayAudioButton from "./PlayAudioButton";
import ImagePopup from "./ImagePopup";

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

  const [cardCounter, setCardCounter] = useState(0);

  const [cardsToBeShowed, setCardsToBeShowed] = useState([]);

  const [sessionStart, setSessionStart] = useState(false);

  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const [isCardFlipped, setIsCardFlipped] = useState(false);

  function addLapse(id, totalLapses, consecutiveLapses) {
    api.patch(`card-stats/${id}`, {
      totalLapses: totalLapses + 1,
      consecutiveLapses: consecutiveLapses + 1,
    });
  }

  function removeConsecutiveLapses(id) {
    api.patch(`card-stats/${id}`, {
      consecutiveLapses: 0,
    });
  }

  function calculateInterval(repetitions, efactor, dueDate, pass, _id) {
    api.post("card-stats/srs", {
      repetitions: repetitions,
      efactor: efactor,
      dueDate: dueDate,
      pass: pass,
      statId: _id,
    });
  }

  function changeState(id, newState): any {
    api
      .patch(`card-stats/${id}`, {
        state: newState,
      })
      .then((res) => {
        return res.data.state;
      })
      .catch((err) => {
        return null;
      });
  }

  function showImage(item) {
    setSRC(item);
    setShow(true);
  }

  function parseSRSResponse(cardInfo, pass) {
    const { cardStats } = cardInfo;
    const {
      state,
      repetitions,
      efactor,
      dueDate,
      _id,
      totalLapses,
      consecutiveLapses,
    } = cardStats;

    console.log(cardCounter);
    console.log(cardsToBeShowed);

    if (state === 0) {
      console.log("STATE 0");
      changeState(_id, 1); //if the card is new, change state from new to learning
      setNewCardsNumber(newCardsNumber - 1);
      setReviewedCardsNumber(reviewedCardsNumber + 1);

      setCardsToBeShowed([...cardsToBeShowed, cardInfo]);
    }
    let newState;

    if (pass) {
      switch (state) {
        case 1:
          console.log("STATE 1");
          newState = changeState(_id, 3); //if the card is in the learning state, change state to reviewing
          if (newState) cardInfo.cardStats.state = newState; //change the state in the current session

          setCardsToBeShowed([...cardsToBeShowed, cardInfo]);
          break;

        case 2:
          console.log("STATE 2");

          newState = changeState(_id, 3); //if the card is in the relearning state, change state to reviewing and remove consecutive lapses
          if (newState) cardInfo.cardStats.state = newState; //change the state in the current session

          removeConsecutiveLapses(_id);

          setRelearnedCardsNumber(relearnedCardsNumber - 1);
          setReviewedCardsNumber(reviewedCardsNumber + 1);

          setCardsToBeShowed([...cardsToBeShowed, cardInfo]);

          break;

        case 3:
          console.log("STATE 3");

          //if the card is in the reviewing state, calculate the interval for the next review and proceed
          calculateInterval(repetitions, efactor, dueDate, pass, _id);
          setReviewedCardsNumber(reviewedCardsNumber - 1);

          break;
      }
    } else {
      switch (state) {
        case 1:
        case 2:
          //if the user fails the card in the learning or relearning state, just send it to the end of the list
          setCardsToBeShowed([...cardsToBeShowed, cardInfo]);
          break;

        case 3:
          //if the user fails the card in the reviewing state, add a lapse and change it's state to relearning
          newState = changeState(_id, 3);
          if (newState) cardInfo.cardStats.state = newState; //change the state in the current session

          addLapse(_id, totalLapses, consecutiveLapses);
          setCardsToBeShowed([...cardsToBeShowed, cardInfo]);

          break;
      }
    }

    setCardCounter(cardCounter + 1);
    setIsCardFlipped(false);
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

        const cardDataForTheDay = cardData.filter(
          (item: any) =>
            new Date(item.cardStats.dueDate).getDay() <= new Date().getDay()
        );

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

        console.log(cardsToBeAdded);
      });
  }, []);

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
        isCardFlipped ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex">
              {cardsToBeShowed[cardCounter].card.images[0] && (
                <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2 2xl:space-x-4">
                  {cardsToBeShowed[cardCounter].card.images.map((item, i) => {
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
              {cardsToBeShowed[cardCounter]
                ? cardsToBeShowed[cardCounter].card.sentence
                : setSessionStart(false)}
            </p>

            <p className="text-2xl sm:text-3xl font-bold">
              {cardsToBeShowed[cardCounter]
                ? cardsToBeShowed[cardCounter].card.focus
                : setSessionStart(false)}
            </p>

            <div className="flex flex-col">
              {cardsToBeShowed[cardCounter].card.bilingualDescription && (
                <ToggleBox
                  title={"Descrição bilíngue"}
                  text={cardsToBeShowed[cardCounter].card.bilingualDescription}
                />
              )}
              {cardsToBeShowed[cardCounter].card.monolingualDescription && (
                <ToggleBox
                  title={"Descrição monolíngue"}
                  text={
                    cardsToBeShowed[cardCounter].card.monolingualDescription
                  }
                />
              )}
              {cardsToBeShowed[cardCounter].card.translation && (
                <ToggleBox
                  title={"Tradução"}
                  text={cardsToBeShowed[cardCounter].card.translation}
                />
              )}
              {cardsToBeShowed[cardCounter].card.notes && (
                <ToggleBox
                  title={"Observações"}
                  text={cardsToBeShowed[cardCounter].card.notes}
                />
              )}
            </div>
            {cardsToBeShowed[cardCounter].card.sentenceAudio[0] && (
              <div className="flex space-x-2">
                {cardsToBeShowed[cardCounter].card.sentenceAudio.map(
                  (item, i) => {
                    return <PlayAudioButton audio={item} key={i} />;
                  }
                )}
                {cardsToBeShowed[cardCounter].card.focusAudio[0] &&
                  cardsToBeShowed[cardCounter].card.focusAudio.map(
                    (item, i) => {
                      return <PlayAudioButton audio={item} key={i} />;
                    }
                  )}
              </div>
            )}

            <div className="flex space-x-2 p-4">
              <button
                className="confirmation-button"
                onClick={() =>
                  parseSRSResponse(cardsToBeShowed[cardCounter], true)
                }
              >
                Acertei
              </button>
              <button
                className="confirmation-button"
                onClick={() =>
                  parseSRSResponse(
                    cardsToBeShowed[cardCounter].cardStats,
                    false
                  )
                }
              >
                Errei
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-48">
            <p className="text-5xl font-bol">
              {cardsToBeShowed[cardCounter]
                ? cardsToBeShowed[cardCounter].card.sentence //try to show the sentence, if theres no sentence, show the focus
                  ? cardsToBeShowed[cardCounter].card.sentence
                  : cardsToBeShowed[cardCounter].card.focus
                : setSessionStart(false)}
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

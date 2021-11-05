import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api, verifyToken } from "../utils/api";

function SRSPanel() {
  let animationHeight = "";

  const [newCardsNumber, setNewCardsNumber] = useState(0);
  const [reviewedCardsNumber, setReviewedCardsNumber] = useState(0);
  const [relearnedCardsNumber, setRelearnedCardsNumber] = useState(0);

  const [cardCounter, setCardCounter] = useState(0);

  const [cardsToBeShowed, setCardsToBeShowed] = useState([]);

  const [sessionStart, setSessionStart] = useState(false);

  const [isPageLoaded, setIsPageLoaded] = useState(false);

  function getTotalCards() {
    return newCardsNumber + relearnedCardsNumber + reviewedCardsNumber;
  }

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

  function changeState(id, newState) {
    api.patch(`card-stats/${id}`, {
      state: newState,
    });
  }

  function parseSRSResponse(cardInfo, pass) {
    console.log(pass);

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

    if (state === 0) {
      changeState(_id, 1); //if the card is new, change state from new to learning
      setNewCardsNumber(newCardsNumber - 1);
      setReviewedCardsNumber(reviewedCardsNumber + 1);

      setCardsToBeShowed([...cardsToBeShowed, cardInfo]);
    }

    if (pass) {
      switch (state) {
        case 1:
          changeState(_id, 3); //if the card is in the learning state, change state to reviewing
          setCardsToBeShowed([...cardsToBeShowed, cardInfo]);
          break;

        case 2:
          changeState(_id, 3); //if the card is in the relearning state, change state to reviewing and remove consecutive lapses
          removeConsecutiveLapses(_id);

          setRelearnedCardsNumber(relearnedCardsNumber - 1);
          setReviewedCardsNumber(reviewedCardsNumber + 1);

          setCardsToBeShowed([...cardsToBeShowed, cardInfo]);

          break;

        case 3:
          //if the card is in the reviewing state, calculate the interval for the next review and proceed
          calculateInterval(repetitions, efactor, dueDate, pass, _id);
          setReviewedCardsNumber(reviewedCardsNumber - 1);

          break;
      }
    } else {
      switch (state) {
        case 1 || 2:
          //if the user fails the card in the learning or relearning state, just send it to the end of the list
          setCardsToBeShowed([...cardsToBeShowed, cardInfo]);
          break;

        case 3:
          //if the user fails the card in the reviewing state, add a lapse and change it's state to relearning
          changeState(_id, 3);
          addLapse(_id, totalLapses, consecutiveLapses);
          setCardsToBeShowed([...cardsToBeShowed, cardInfo]);

          break;
      }
    }

    setCardCounter(cardCounter + 1);
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

        setCardsToBeShowed([
          ...cardsToBeAdded,
          ...cardsBeingReviewed,
          ...cardsBeingLearned,
          ...cardsBeingRelearned,
        ]);

        console.log(cardsToBeShowed);

        setNewCardsNumber(cardsToBeAdded.length);

        const totalReviewedCards =
          cardsBeingLearned.length + cardsBeingReviewed.length;

        setReviewedCardsNumber(totalReviewedCards);
        setRelearnedCardsNumber(cardsBeingRelearned.length);

        setIsPageLoaded(true);
      });
  }, []);

  return (
    <motion.div
      className="bg-white flex h-screen w-screen items-center justify-center sm:rounded-lg 
      sm:shadow-lg sm:my-8 sm:mx-8 md:my-8 md:mx-16 lg:my-16 lg:mx-32"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: animationHeight, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {sessionStart && isPageLoaded ? (
        <div className="flex flex-col items-center justify-center space-y-48">
          <p className="text-5xl font-bol">
            {cardsToBeShowed[cardCounter]
              ? cardsToBeShowed[cardCounter].card.focus
              : setSessionStart(false)}
          </p>

          <div className="flex space-x-2">
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
                parseSRSResponse(cardsToBeShowed[cardCounter].cardStats, false)
              }
            >
              Errei
            </button>
          </div>
        </div>
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

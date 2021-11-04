import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api, verifyToken } from "../utils/api";

function SRSPanel() {
  let animationHeight = "";

  const [newCardsNumber, setNewCardsNumber] = useState(0);
  const [reviewedCardsNumber, setReviewedCardsNumber] = useState(0);
  const [relearnedCardsNumber, setRelearnedCardsNumber] = useState(0);

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
            new Date(item.cardStats.dueDate).getDay() === new Date().getDay()
        );

        console.log(cardDataForTheDay);

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

        setNewCardsNumber(cardsToBeAdded.length);

        console.log(cardsToBeAdded);
        console.log(cardsBeingLearned);
        console.log(cardsBeingRelearned);
        console.log(cardsBeingReviewed);

        const totalReviewedCards =
          cardsBeingLearned.length + cardsBeingReviewed.length;

        setReviewedCardsNumber(totalReviewedCards);
        setRelearnedCardsNumber(cardsBeingRelearned.length);
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
      <div className="flex flex-col space-y-2">
        <p className="text-2xl">Bem-vindo de volta!</p>

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
      </div>
    </motion.div>
  );
}

export default SRSPanel;

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import CardInfo from "./CardInfo";
import CardTableItem from "./CardTableItem";

function CardTable({ deckId }) {
  const [cards, setCards] = useState([]);

  function populateTable() {
    //To do here
    //Figure out how to populate the table dynamically
    //Make a sliding animation for the card details
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/cards/get_cards/${deckId}`)
      .then((res) => {
        const cardsInfo = res.data.map((item) => {
          return {
            id: item._id,
            focus: item.focus,
            dateAdded: item.dateAdded,
            dateDue: item.dateDue,
            lapses: item.lapses,
            deckId: item.deck,
            bilingualDescription: item.bilingualDescription ?? "",
            focusAudio: item.focusAudio ?? [],
            images: item.images ?? [],
            monolingualDescription: item.monolingualDescription ?? "",
            sentence: item.sentence ?? "",
            sentenceAudio: item.sentenceAudio ?? "",
          };
        });
        setCards(cardsInfo);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [deckId]);

  return (
    <div className="w-screen">
      {cards.map((card, i) => {
        return (
          <CardTableItem
            key={i}
            cardDetails={{
              tableKey: i + 1,
              card,
            }}
          />
        );
      })}
    </div>
  );
}

export default CardTable;

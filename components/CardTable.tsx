import axios from "axios";
import { AnimatePresence, motion, AnimateSharedLayout } from "framer-motion";
import { useEffect, useState } from "react";
import CardInfo from "./CardInfo";
import CardTableItem from "./CardTableItem";

function CardTable({ deckId }) {
  const [cards, setCards] = useState([]);

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
            translation: item.translation ?? "",
            notes: item.notes ?? "",
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
      <AnimateSharedLayout>
        <motion.ul layout>
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
        </motion.ul>
      </AnimateSharedLayout>
    </div>
  );
}

export default CardTable;

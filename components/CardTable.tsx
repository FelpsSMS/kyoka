import axios from "axios";
import { AnimatePresence, motion, AnimateSharedLayout } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { api } from "../utils/api";
import CardInfo from "./CardInfo";
import CardTableItem from "./CardTableItem";

function CardTable({ deckId }) {
  const [cards, setCards] = useState([]);
  const [hasCards, setHasCards] = useState(true);

  useEffect(() => {
    api
      .get(`cards/get_cards/${deckId}`)
      .then(async (res) => {
        const cardsInfo = await Promise.all(
          res.data.map(async (item) => {
            const cardStats = await api
              .post(`card-stats/card`, {
                cardId: item._id,
              })
              .then((res) => {
                return res.data[0];
              });

            return {
              id: item._id,
              focus: item.focus,
              dateAdded: item.dateAdded,
              dateDue: cardStats.dueDate,
              lapses: cardStats.totalLapses,
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
          })
        );

        if (cardsInfo.length < 1 && deckId != undefined) {
          setHasCards(false);
        }

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
          {hasCards ? (
            cards.map((card, i) => {
              return (
                <CardTableItem
                  key={i}
                  cardDetails={{
                    tableKey: i + 1,
                    card,
                  }}
                />
              );
            })
          ) : (
            <div className="flex items-center justify-center p-4 font-bold italic">
              <p className="text-3xl">Ainda não há nenhuma carta neste deck</p>
            </div>
          )}
        </motion.ul>
      </AnimateSharedLayout>
    </div>
  );
}

export default CardTable;

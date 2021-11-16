import axios from "axios";
import { AnimatePresence, motion, AnimateSharedLayout } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { api, verifyToken } from "../utils/api";
import CardInfo from "./CardInfo";
import CardTableItem from "./CardTableItem";

function CardTable({ deckId, search, sorting, readOnly }) {
  const [cards, setCards] = useState([]);
  const [hasCards, setHasCards] = useState(true);

  useEffect(() => {
    const userId = verifyToken();

    api
      .get(`cards/get_cards/${deckId}`)
      .then(async (res) => {
        let cardsInfo: any = await Promise.all(
          res.data.map(async (item) => {
            const cardStats = await api
              .post(`card-stats/card`, {
                cardId: item._id,
                userId: userId,
              })
              .then((res) => {
                if (res.data) {
                  return res.data;
                } else {
                  return { dueDate: Date.now(), totalLapses: 0 };
                }
              });

            return {
              id: item._id,
              focus: item.focus,
              dateAdded: item.dateAdded,
              dueDate: cardStats.dueDate,
              lapses: cardStats.totalLapses,
              leech: cardStats.leech,
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

        if (search) {
          cardsInfo = cardsInfo.filter((item: any) => {
            if (item.focus.toUpperCase().includes(search.toUpperCase())) {
              return item;
            }
          });
        }

        if (cardsInfo.length < 1 && deckId != undefined && !search) {
          setHasCards(false);
        }

        if (sorting == 0) {
          cardsInfo.sort((a: any, b: any) => {
            const titleA = a.focus.toUpperCase(); // ignore upper and lowercase
            const titleB = b.focus.toUpperCase(); // ignore upper and lowercase

            if (titleA < titleB) {
              return -1;
            }
            if (titleA > titleB) {
              return 1;
            }
          });
        }

        if (sorting == 1) {
          cardsInfo.sort((a: any, b: any) => {
            return a.dueDate - b.dueDate;
          });
        }

        setCards(cardsInfo);
      })
      /*       .then(async () => {
        await api
          .post("deck-stats/stats", {
            userId: userId,
            deckId: deckId,
          })
          .then(() => {
            if (sharedDeck) {
              setReadOnly(true);
            }
          });
      }) */
      .catch((err) => {
        console.log(err);
      });
  }, [deckId, search, sorting]);

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
                  readOnly={readOnly}
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

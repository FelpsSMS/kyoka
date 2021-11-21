import { motion, AnimateSharedLayout } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { api, verifyToken } from "../utils/api";
import CardTableItem from "./CardTableItem";
import { useTranslation } from "next-i18next";

export default function CardTable({ deckId, search, sorting, readOnly }) {
  const [cards, setCards] = useState([]);
  const [hasCards, setHasCards] = useState(true);
  const { t } = useTranslation();

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
              layoutInfo: item.layoutInfo[0],
              dateAdded: item.dateAdded,
              dueDate: cardStats.dueDate,
              lapses: cardStats.totalLapses,
              leech: cardStats.leech,
              deckId: item.deck,
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
              console.log(card);
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
              <p className="text-3xl my-8">{t("no_cards_yet_msg")}</p>
            </div>
          )}
        </motion.ul>
      </AnimateSharedLayout>
    </div>
  );
}

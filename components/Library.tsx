import React, { useEffect, useState } from "react";
import { api, verifyToken } from "../utils/api";
import LibraryItem from "./LibraryItem";

export default function Library({ sorting, libraryChanged, search }) {
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    const userId = verifyToken();

    api
      .post("deck-stats/user", {
        userId: userId,
      })
      .then(async (res) => {
        let decks;
        const data = res.data;

        decks = await Promise.all(
          data.map(async (item) => {
            const deck = api.get(`decks/${item.deck}`).then((res) => {
              return res.data;
            });

            return deck;
          })
        );

        if (search) {
          decks = decks.filter((item: any) => {
            if (item.name.toUpperCase().includes(search.toUpperCase())) {
              return item;
            }
          });
        }

        const formattedData = await Promise.all(
          decks.map(async (item: any) => {
            const numberOfCards = await api
              .get(`cards/get_cards/${item._id}`)
              .then((res) => {
                return res.data.length;
              });

            return {
              title: item.name,
              id: item._id,
              numberOfCards: numberOfCards,
              subject: item.subject,
            };
          })
        );

        if (sorting == 0) {
          formattedData.sort((a: any, b: any) => {
            const titleA = a.title.toUpperCase(); // ignore upper and lowercase
            const titleB = b.title.toUpperCase(); // ignore upper and lowercase

            if (titleA < titleB) {
              return -1;
            }
            if (titleA > titleB) {
              return 1;
            }
          });
        }

        if (sorting == 1) {
          formattedData.sort((a: any, b: any) => {
            return b.numberOfCards - a.numberOfCards;
          });
        }

        setLibrary(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sorting, libraryChanged, search]);

  return (
    <div
      className="grid grid-cols-1 grid-wrap
      sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
      gap-8"
    >
      {library.map((item, i) => {
        return (
          <LibraryItem
            key={i}
            title={item.title}
            numberOfCards={item.numberOfCards}
            subject={item.subject}
            id={item.id}
            pathName={"decks/[deckId]"}
          />
        );
      })}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import LibraryItem from "./LibraryItem";

export default function DeckRepo() {
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    api
      .post("decks/shared", {})
      .then(async (res) => {
        let decks;
        const data = res.data;

        console.log(data);

        decks = await Promise.all(
          data.map(async (item) => {
            const deck = api.get(`decks/${item._id}`).then((res) => {
              return res.data;
            });

            return deck;
          })
        );

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

        setLibrary(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
            id={item.id}
            subject={item.subject}
            pathName={"shared_decks/[deckId]"}
          />
        );
      })}
    </div>
  );
}

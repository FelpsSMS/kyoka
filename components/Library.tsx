import axios from "axios";
import React, { useEffect, useState } from "react";
import LibraryItem from "./LibraryItem";

export default function Library() {
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/decks/")
      .then(async (res) => {
        const data = res.data;

        const formattedData = await Promise.all(
          data.map(async (item) => {
            const numberOfCards = await axios
              .get(`http://localhost:3001/cards/get_cards/${item._id}`)
              .then((res) => {
                return res.data.length;
              });

            return {
              title: item.name,
              id: item._id,
              numberOfCards: numberOfCards,
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
          />
        );
      })}
    </div>
  );
}

import axios from "axios";
import React, { useEffect, useState } from "react";
import LibraryItem from "./LibraryItem";

export default function Library() {
  const [library, setLibrary] = useState([]);

  function getDecks() {
    axios
      .get("http://localhost:3001/decks/")
      .then((res) => {
        const data = res.data;

        const formattedData = data.map((item) => {
          return { title: item.name, id: item._id };
        });

        setLibrary(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getDecks();
  }, []);

  return (
    <div
      className="grid grid-cols-1 gap-y-4 justify-items-center items-center grid-wrap h-full overflow-auto 
    sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {library.map((item, i) => {
        return (
          <LibraryItem
            key={i}
            title={item.title}
            numberOfCards={0}
            id={item.id}
          />
        );
      })}
    </div>
  );
}

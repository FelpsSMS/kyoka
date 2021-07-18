import React from "react";
import LibraryItem from "./LibraryItem";

export default function Library() {
  const library = [
    { title: "English", numberOfCards: 100 },
    { title: "English", numberOfCards: 100 },
    { title: "English", numberOfCards: 100 },
    { title: "English", numberOfCards: 100 },
    { title: "English", numberOfCards: 100 },
  ];

  return (
    <div className="grid grid-cols-1 gap-y-4 justify-items-center items-center grid-wrap h-full overflow-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {library.map((item, i) => {
        return (
          <LibraryItem
            key={i}
            title={item.title}
            numberOfCards={item.numberOfCards}
          />
        );
      })}
    </div>
  );
}

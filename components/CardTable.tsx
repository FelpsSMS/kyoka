import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import CardInfo from "./CardInfo";
import CardTableItem from "./CardTableItem";

function CardTable({ deckId }) {
  function populateTable() {
    //To do here
    //Figure out how to populate the table dynamically
    //Make a sliding animation for the card details
  }

  useEffect(() => {
    console.log(deckId);
  }, [deckId]);

  return (
    <div className="w-screen">
      <CardTableItem
        cardDetails={{
          focus: "AAAA",
          dateDue: "01/01/2021",
          deckId: deckId,
        }}
      />
    </div>
  );
}

export default CardTable;

import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import CardInfo from "./CardInfo";

function CardTableItem({ cardDetails: { card, tableKey } }) {
  const [showCardInfo, setShowCardInfo] = useState(false);

  const formattedDateAdded = new Date(card.dateAdded).toLocaleDateString(
    "pt-br"
  );
  const formattedDateDue = new Date(card.dateDue).toLocaleDateString("pt-br");

  return (
    <div className="flex flex-col mx-4 sm:mx-16 my-8 border-b-2 bg-white">
      {/* Row */}
      <div
        className="flex border-r-2 border-l-2 border-t-2"
        onClick={() => setShowCardInfo(!showCardInfo)}
      >
        {/* Col */}
        <div className=" flex flex-col w-16 border-r-2">
          <div className="text-center bg-black text-white p-2 border-b-2">
            #
          </div>
          <div className="text-right text-black p-2">{tableKey}</div>
        </div>

        {/* Col */}
        <div className="flex flex-col w-full border-r-2 min-w-0">
          {/* Min width to make it so truncate doesn't overflow */}
          <div className="text-center bg-black text-white p-2 border-b-2">
            Foco
          </div>
          <div className="text-right text-black p-2 truncate">{card.focus}</div>
        </div>

        {/* Col */}
        <div className="flex-col w-32 hidden ms:inline-block border-r-2">
          <div className="text-center bg-black text-white p-2 whitespace-nowrap border-b-2">
            Próxima revisão
          </div>
          <div className="text-right text-black p-2">{formattedDateDue}</div>
        </div>

        {/* Col */}
        <div className="flex-col w-32 whitespace-nowrap border-r-2 hidden sm:inline-block">
          <div className="text-center bg-black text-white border-b-2 p-2">
            Data de adição
          </div>
          <div className="text-right text-black p-2">{formattedDateAdded}</div>
        </div>

        {/* Col */}

        <div className="flex-col w-16 hidden sm:inline-block">
          <div className="text-center bg-black text-white p-2 border-b-2">
            Lapsos
          </div>
          <div className="text-right text-black p-2">{card.lapses}</div>
        </div>
      </div>
      <AnimatePresence>
        {/* You need to place the AnimatePresence before the conditional to make exit activate  */}
        {showCardInfo && <CardInfo cardDetails={card} />}
      </AnimatePresence>
    </div>
  );
}

export default CardTableItem;

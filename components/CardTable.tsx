import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import CardInfo from "./CardInfo";
import CardTableItem from "./CardTableItem";

function CardTable({ deckId }) {
  function populateTable() {
    //To do here
    //Figure out how to populate the table dynamically
    //Make a sliding animation for the card details
  }

  return (
    <div className="w-screen">
      <CardTableItem
        cardDetails={{
          focus: "AAAA",
          dateDue: "01/01/2021",
          deckId: deckId,
        }}
      />
      {/*          <div className="border-r-2 p-2 w-full">Foco</div>
          <div className="border-r-2 p-2 w-64">Próxima revisão</div>
          <div className="border-r-2 p-2 w-64 hidden sm:inline-block">
            Data de adição
          </div>
          <div className="p-2 w-16 hidden sm:inline-block">Lapsos</div>
        </div>
        <div className="text-right w-full text-black border-b-2 flex flex-col">
          <div className="border-l-2 border-r-2 w-full flex">
            <div className="border-r-2 p-2 w-16">9999</div>
            <div className="border-r-2 p-2 w-full truncate">
              dadadadadadadadada
            </div>
            <div className="border-r-2 p-2 w-64">01/01/2021</div>
            <div className="border-r-2 p-2 w-64 hidden sm:inline-block">
              01/01/2021
            </div>
            <div className="p-2 w-16 hidden sm:inline-block">9999</div>
          </div>
        </div> */}
      {/*         <table className="table-fixed w-full text-right border-collapse ">
          <tr className="text-center border-2">
            <th className="p-2 w-14 text-white bg-black text-xl border-r-2">
              #
            </th>
            <th className="p-2 text-white bg-black text-xl border-r-2">Foco</th>
            <th className="p-2 text-white bg-black text-xl border-r-2 hidden xs:table-cell">
              Próxima revisão
            </th>
            <th className="p-2 text-white bg-black text-xl border-r-2 hidden sm:table-cell">
              Data de adição
            </th>
            <th className="p-2 w-20 text-white bg-black text-xl border-l-2 hidden sm:table-cell">
              Lapsos
            </th>
          </tr>

          <tr className="border-2" onClick={() => getCard("9999")}>
            <td className="p-2 border-r-2 border-t-2">9999</td>
            <td className="p-2 border-r-2 border-t-2 whitespace-nowrap truncate">
              Lorem ipsum dolor, sit
            </td>
            <td className="p-2 border-r-2 hidden sm:table-cell">01/01/2021</td>
            <td className="p-2 border-r-2 hidden xs:table-cell">01/01/2021</td>
            <td className="p-2 border-r-2 hidden sm:table-cell">9999</td>
          </tr>
          <AnimatePresence>
            {showCard && (
              <tr className="border-l-2 border-r-2 break-words">
                <motion.div
                  className="flex flex-col p-2 w-full"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  exit={{ opacity: 0, y: -50 }}
                >
                  Lorem ipsum dolor sit
                </motion.div>
              </tr>
            )}
          </AnimatePresence>
          <AnimatePresence>
            <motion.tr
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              exit={{ opacity: 0, y: -100 }}
              className="border-2 border-collapse"
            >
              <td className="p-2 border-r-2 border-t-2">teste</td>
              <td className="p-2 border-r-2 border-t-2">teste</td>
              <td className="p-2 border-r-2 border-t-2 hidden xs:table-cell">
                teste
              </td>
              <td className="p-2 border-r-2 border-t-2 hidden sm:table-cell">
                teste
              </td>
              <td className="p-2 border-r-2 border-t-2 hidden sm:table-cell">
                teste
              </td>
            </motion.tr>
          </AnimatePresence>
        </table> */}
    </div>
  );
}

export default CardTable;

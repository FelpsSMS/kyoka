import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

function CardTable() {
  const [cardId, setCardId] = useState("");
  const [showCard, setShowCard] = useState(false);

  function getCard(id) {
    setCardId(id);

    setShowCard(!showCard);
  }

  function populateTable() {
    //To do here
    //Figure out how to populate the table dynamically
    //Make a sliding animation for the card details
  }

  return (
    <div className="h-screen w-screen">
      <div className="flex flex-col mx-4 sm:mx-16 my-8 border-b-2">
        {/* Row */}
        <div className="flex border-r-2 border-l-2 border-t-2">
          {/* Col */}
          <div className=" flex flex-col w-16 border-r-2">
            <div className="text-center bg-black text-white p-2 border-b-2">
              #
            </div>
            <div className="text-right text-black p-2">9999</div>
          </div>

          {/* Col */}
          <div className="flex flex-col w-full border-r-2 min-w-0">
            {/* Min width to make it so truncate doesn't overflow */}
            <div className="text-center bg-black text-white p-2 border-b-2">
              Foco
            </div>
            <div className="text-right text-black p-2 truncate">aaaaaaa</div>
          </div>

          {/* Col */}
          <div className="flex-col w-32 hidden ms:inline-block border-r-2">
            <div className="text-center bg-black text-white p-2 whitespace-nowrap border-b-2">
              Próxima revisão
            </div>
            <div className="text-right text-black p-2">01/01/2021</div>
          </div>

          {/* Col */}
          <div className="flex-col w-32 whitespace-nowrap border-r-2 hidden sm:inline-block">
            <div className="text-center bg-black text-white border-b-2 p-2">
              Data de adição
            </div>
            <div className="text-right text-black p-2">01/01/2021</div>
          </div>

          {/* Col */}

          <div className="flex-col w-16 hidden sm:inline-block">
            <div className="text-center bg-black text-white p-2 border-b-2">
              Lapsos
            </div>
            <div className="text-right text-black p-2">9999</div>
          </div>
        </div>

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
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis
              placeat velit repudiandae temporibus culpa, reiciendis tenetur
              cupiditate fuga magni ab natus odio quia perferendis distinctio
              nisi veritatis officiis magnam sunt fugit! Qui doloribus facere
              saepe voluptatibus a omnis ratione. Molestias, sunt unde inventore
              sapiente omnis accusamus. Doloribus explicabo perferendis quas
              accusantium soluta veniam, incidunt error hic architecto corporis
              harum earum ipsa asperiores repellendus odio officia eum tenetur
              alias laudantium maxime quos quaerat, temporibus qui! Amet,
              dolores voluptates. Laudantium eos ducimus quam quas, et
              necessitatibus nobis error fugit, facilis voluptatem aspernatur
              quae illo eum quo aut accusamus vero commodi, laborum provident.
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
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Accusamus eius animi aliquid accusantium? Iste molestiae fuga
                  esse excepturi, odio cumque dignissimos praesentium omnis,
                  debitis fugit earum odit mollitia, enim architecto aperiam
                  laboriosam in quam vel. Ut error, alias quam culpa distinctio
                  adipisci dolorem debitis expedita voluptas saepe at voluptate
                  laboriosam quidem aliquid explicabo a impedit magnam. Nam
                  voluptatum ad, ex officiis earum corrupti iure tempora,
                  exercitationem aut, quo quasi veritatis ea aperiam? Impedit ex
                  dolore saepe ratione nostrum, animi est doloremque unde
                  aspernatur. Asperiores unde amet libero. Iste reiciendis
                  accusantium labore at similique, sed praesentium quisquam quae
                  numquam aliquam. Non?
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
    </div>
  );
}

export default CardTable;

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
    <div className="h-screen">
      <div
        className={`border-2  flex flex-col ${
          showCard ? "mx-8 mt-8 rounded-t-lg" : "m-8 rounded-lg"
        }`}
      >
        <table className="table-fixed w-full text-right border-collapse">
          <tr className="text-center">
            <th className="p-2 w-14 text-white bg-black text-xl border-r-2 rounded-tl-lg">
              #
            </th>
            <th className="p-2 text-white bg-black text-xl border-r-2">Foco</th>
            <th className="p-2 text-white bg-black text-xl border-r-2 hidden xs:table-cell">
              Próxima revisão
            </th>
            <th className="p-2 text-white bg-black text-xl border-r-2 hidden sm:table-cell">
              Data de adição
            </th>
            <th className="p-2 w-20 text-white bg-black text-xl border-l-2 rounded-tr-lg hidden sm:table-cell">
              Lapsos
            </th>
          </tr>

          <tr onClick={() => getCard("9999")}>
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
            <td className="p-2 border-r-2 border-t-2 hidden sm:table-cell">
              01/01/2021
            </td>
            <td className="p-2 border-r-2 border-t-2 hidden xs:table-cell">
              01/01/2021
            </td>
            <td className="p-2 border-r-2 border-t-2 hidden sm:table-cell">
              9999
            </td>
          </tr>

          <tr className={showCard && "hidden"}>
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
          </tr>
        </table>
      </div>
      <div
        className={`border-r-2 border-l-2 border-b-2 rounded-b-lg mx-8 flex flex-col p-2 ${
          !showCard && "hidden"
        }`}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus eius
        animi aliquid accusantium? Iste molestiae fuga esse excepturi, odio
        cumque dignissimos praesentium omnis, debitis fugit earum odit mollitia,
        enim architecto aperiam laboriosam in quam vel. Ut error, alias quam
        culpa distinctio adipisci dolorem debitis expedita voluptas saepe at
        voluptate laboriosam quidem aliquid explicabo a impedit magnam. Nam
        voluptatum ad, ex officiis earum corrupti iure tempora, exercitationem
        aut, quo quasi veritatis ea aperiam? Impedit ex dolore saepe ratione
        nostrum, animi est doloremque unde aspernatur. Asperiores unde amet
        libero. Iste reiciendis accusantium labore at similique, sed praesentium
        quisquam quae numquam aliquam. Non?
      </div>
    </div>
  );
}

export default CardTable;

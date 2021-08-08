function CardTable() {
  function populateTable() {}

  return (
    <div className="h-screen">
      <div className="border-2 rounded-lg m-8">
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

          <tr onClick={() => console.log("teste")}>
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

          <tr>
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
    </div>
  );
}

export default CardTable;

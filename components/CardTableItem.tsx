import { useState } from "react";
import CardInfo from "./CardInfo";

function CardTableItem({ cardDetails }) {
  const [showCardInfo, setShowCardInfo] = useState(false);

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
      {showCardInfo && <CardInfo cardDetails={cardDetails} />}
    </div>
  );
}

export default CardTableItem;

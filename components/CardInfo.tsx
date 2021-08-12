import { CardInfoUpdateForm } from "./CardInfoUpdateForm";
import { NewCardForm } from "./NewCardForm";

function CardInfo({ cardDetails: { deckId, focus, dateDue } }) {
  return (
    <div className="bg-white border-2">
      {/* Adjustable element */}
      <CardInfoUpdateForm deckId={deckId} />
    </div>
  );
}

export default CardInfo;

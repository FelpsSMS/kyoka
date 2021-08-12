import { motion } from "framer-motion";
import { CardInfoUpdateForm } from "./CardInfoUpdateForm";

function CardInfo({ cardDetails: card }) {
  console.log(card);
  return (
    <motion.div
      className="bg-white border-2"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <CardInfoUpdateForm deckId={card.deckId} />
    </motion.div>
  );
}

export default CardInfo;

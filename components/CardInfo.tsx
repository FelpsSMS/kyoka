import { motion } from "framer-motion";
import { CardInfoUpdateForm } from "./CardInfoUpdateForm";

function CardInfo({ cardDetails: { deckId, focus, dateDue } }) {
  return (
    <motion.div
      className="bg-white border-2"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <CardInfoUpdateForm deckId={deckId} />
    </motion.div>
  );
}

export default CardInfo;

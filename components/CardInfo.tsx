import { motion } from "framer-motion";
import { CardInfoUpdateForm } from "./CardInfoUpdateForm";

export default function CardInfo({ cardDetails: card, readOnly }) {
  return (
    <motion.div
      className="bg-white border-t-2"
      layout
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <CardInfoUpdateForm cardDetails={card} readOnly={readOnly} />
    </motion.div>
  );
}

import { motion } from "framer-motion";

export default function LibraryItem({ title, numberOfCards }) {
  return (
    <motion.div
      className="bg-white flex flex-col text-black shadow-lg w-4/5 rounded-lg 
        justify-center items-center max-w-xs hover:cursor-pointer"
      whileHover={{ scale: 1.1 }}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "13rem", opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center">
        <p className="font-bold text-4xl">{title}</p>
        <p className="text-2xl font-thin">{numberOfCards} cartas</p>
      </div>
      {/*       <motion.button
        className="mb-4 text-white bg-black py-2 px-4 w-4/5 rounded-sm"
        whileHover={{ scale: 1.1 }}
      >
        Visualizar
      </motion.button> */}
    </motion.div>
  );
}

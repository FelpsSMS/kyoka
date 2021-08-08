import { motion } from "framer-motion";
import { useEffect } from "react";

function SRSPanel() {
  let animationHeight = "";

  useEffect(() => {
    animationHeight = window.innerWidth > 640 ? "80%" : "100%"; //640px is the cutoff for sm in tailwind
  }, []);

  return (
    <motion.div
      className="bg-white flex justify-center items-center w-full h-full sm:shadow-lg sm:rounded-lg sm:w-4/5 sm:h-4/5"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: animationHeight, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <p className="text-2xl">SRS Panel</p>
    </motion.div>
  );
}

export default SRSPanel;

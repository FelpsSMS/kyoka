import { motion } from "framer-motion";
import { useEffect } from "react";

function SRSPanel() {
  let animationHeight = "";

  useEffect(() => {
    animationHeight = window.innerWidth > 640 ? "80%" : "100%"; //640px is the cutoff for sm in tailwind
  }, []);

  return (
    <motion.div
      className="bg-white flex h-screen w-screen items-center justify-center sm:rounded-lg sm:shadow-lg sm:my-8 sm:mx-8 md:my-8 md:mx-16 lg:my-16 lg:mx-32"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: animationHeight, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <p className="text-2xl">SRS Panel</p>
    </motion.div>
  );
}

export default SRSPanel;

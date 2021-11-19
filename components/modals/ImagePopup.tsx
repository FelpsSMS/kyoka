import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef } from "react";
import Image from "next/image";

export default function ImagePopup({ show, setShow, src }) {
  const centralDiv = useRef(null);

  const imageLoader = ({ src }) => {
    return src;
  };

  return (
    <AnimatePresence>
      <Dialog
        static
        initialFocus={centralDiv}
        open={show}
        onClose={() => setShow(false)}
        className=""
      >
        {({ open }) => (
          <>
            {/* Trick to center a fixed div */}
            {open && (
              <Dialog.Overlay
                className="fixed h-screen w-screen bg-black z-50 inset-0 mx-auto 
                flex items-center justify-center"
                as={motion.div}
                initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }} //Opacity is inherited, backgroundColor isn't
                animate={{
                  height: "auto",
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="bg-transparent flex flex-col items-center justify-center space-y-8 opacity-100 
                  p-4 sm:p-8 rounded-lg mx-2 relative"
                  initial={{ height: 0, opacity: 0, width: 0 }}
                  animate={{ height: "60%", width: "60%", opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  ref={centralDiv}
                >
                  <Image
                    className="rounded-lg"
                    loader={imageLoader}
                    src={src.url}
                    alt="Uploaded image"
                    layout="fill"
                    objectFit="contain"
                  />
                </motion.div>
                {src.photographer && (
                  <p className="font-bold absolute top-28 z-10 text-white">
                    {"Photo by "}
                    <a href={src.photographerUrl} className="text-blue-300">
                      {src.photographer}
                    </a>
                    {" on "}
                    <a href={src.siteUrl} className="text-blue-300">
                      {"Pexels"}
                    </a>
                  </p>
                )}
              </Dialog.Overlay>
            )}
          </>
        )}
      </Dialog>
    </AnimatePresence>
  );
}

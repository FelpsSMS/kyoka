import { Dialog } from "@headlessui/react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { ref } from "yup";
import { api, verifyToken } from "../utils/api";

export default function HeadsUpMessage({
  show,
  setShow,
  title,
  color,
  colorFocusOrHover,
}) {
  const completeButtonRef = useRef(null);

  return (
    <AnimatePresence>
      {show && ( //needed for a bug with nextjs
        <Dialog
          static
          initialFocus={completeButtonRef}
          open={show}
          onClose={setShow}
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
                    className="bg-white fixed flex flex-col items-center justify-center space-y-8 opacity-100 
      p-4 sm:p-8 rounded-lg shadow-lg mx-2"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Dialog.Title className="text-xl font-bold sm:text-2xl">
                      {title}
                    </Dialog.Title>

                    <div className="flex space-x-2 sm:space-x-8">
                      <button
                        ref={completeButtonRef}
                        className={`${color} text-white p-2 sm:px-16 rounded-sm text-xl font-bold focus:text-gray-200 
                 focus:bg-${colorFocusOrHover} hover:text-gray-200 hover:${colorFocusOrHover} outline-none px-2`}
                      >
                        Confirmar
                      </button>
                    </div>
                  </motion.div>
                </Dialog.Overlay>
              )}
            </>
          )}
        </Dialog>
      )}
    </AnimatePresence>
  );
}

import { Dialog } from "@headlessui/react";
import { Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import { TextField } from "./TextField";
import Image from "next/image";

import { api, verifyToken } from "../utils/api";

export default function ImagePopup({ show, setShow, src }) {
  const centralDiv = useRef(null);

  const imageLoader = ({ src }) => {
    console.log(src);
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
                  className="bg-transparent fixed flex flex-col items-center justify-center space-y-8 opacity-100 
                  p-4 sm:p-8 rounded-lg mx-2"
                  initial={{ height: 0, opacity: 0, width: 0 }}
                  animate={{ height: "60%", width: "60%", opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  ref={centralDiv}
                >
                  <Image
                    className="rounded-lg"
                    loader={imageLoader}
                    src={src}
                    alt="Uploaded image"
                    layout="fill"
                    objectFit="contain"
                  />
                </motion.div>
              </Dialog.Overlay>
            )}
          </>
        )}
      </Dialog>
    </AnimatePresence>
  );
}

import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export default function DisplayLoading({
  show,
  setShow,
  loadingBarProgress,
  reload,
}) {
  const completeButtonRef = useRef(null);
  const { t } = useTranslation();

  const router = useRouter();
  const { locale } = router;

  function handleReload() {
    setShow(false);
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale });
  }

  return (
    <AnimatePresence>
      {show && ( //needed for a bug with nextjs
        <Dialog
          static
          initialFocus={completeButtonRef}
          open={show}
          onClose={() => {}}
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
                    ref={completeButtonRef}
                  >
                    <div className="p-4 items-center justify-center space-y-4">
                      <label className="font-bold text-2xl">
                        {t("loading_msg")}
                      </label>
                      <div
                        className={`bg-black h-4 rounded`}
                        style={{ width: `${loadingBarProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex space-x-2 sm:space-x-8">
                      {loadingBarProgress > 99 && (
                        <button
                          className="bg-blue-800 text-white p-2 sm:px-16 rounded-sm text-xl font-bold focus:text-gray-200 
                        focus:bg-blue-900 hover:text-gray-200 hover:bg-blue-900 outline-none px-2"
                          onClick={() => (reload ? handleReload() : setShow())}
                        >
                          {t("confirm")}
                        </button>
                      )}
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

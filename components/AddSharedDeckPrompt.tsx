import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { api, verifyToken } from "../utils/api";

function AddSharedDeckPrompt({
  show,
  setShow,
  id,
  title,
  setShowErrorMessage,
}) {
  const completeButtonRef = useRef(null);
  const router = useRouter();

  async function confirmFunction() {
    const userId = verifyToken();

    const decksInUsersLibrary = await api
      .post("deck-stats/user", {
        userId: userId,
      })
      .then((res) => {
        return res.data.map((item) => {
          return item.deck;
        });
      });

    if (decksInUsersLibrary.includes(id)) {
      setShowErrorMessage(true);
    } else {
      //create deck stats
      await api
        .post("deck-stats", {
          deck: id,
          user: userId,
          readOnly: true,
        })
        .then(async () => {
          const cardInfo = await api.get(`cards/get_cards/${id}`);
          const cards = cardInfo.data;

          //create stats for each card in the deck
          cards.map(async (item) => {
            await api.post("card-stats", {
              card: item._id,
              user: userId,
            });
          });
        })
        .then(() => {
          setTimeout(() => router.back(), 500); //small delay before going back just in case
        });
    }
  }

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
                        className="bg-blue-800 text-white p-2 sm:px-16 rounded-sm text-xl font-bold focus:text-gray-200 
                        focus:bg-blue-900 hover:text-gray-200 hover:bg-blue-900 outline-none px-2"
                        onClick={() => confirmFunction()}
                      >
                        Confirmar
                      </button>
                      <button
                        className="confirmation-button px-2 sm:px-16"
                        ref={completeButtonRef}
                        onClick={() => setShow}
                      >
                        Cancelar
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

export default AddSharedDeckPrompt;

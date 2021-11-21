import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { api, verifyToken } from "../../utils/api";
import { useTranslation } from "next-i18next";

export default function DeletePrompt({ show, setShow, id, routeName, title }) {
  const completeButtonRef = useRef(null);
  const router = useRouter();
  const { t } = useTranslation();

  async function confirmFunction() {
    const userId = verifyToken();

    if (routeName == "cards") {
      const card = await api.get(`cards/${id}`);

      const deckId = card.data.deck;

      const deckInfo = await api
        .post("deck-stats/stats", {
          deckId: deckId,
          userId: userId,
        })
        .then((res) => {
          return res.data;
        });

      await api
        .post("card-stats/delete-by-card-and-user-id", {
          cardId: id,
          userId: userId,
          readOnly: deckInfo.readOnly,
        })
        .then(async (res) => {
          const deleteAuth = res.data;

          if (deleteAuth) {
            await api
              .post("cards/authenticate-deletion-and-delete", {
                creator: userId,
                id: id,
              })
              .then(() => {
                setTimeout(() => router.back(), 500); //small delay before going back just in case
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            setTimeout(() => router.back(), 500); //small delay before going back just in case
          }
        });
    }

    if (routeName == "decks") {
      await api
        .post("deck-stats/delete-by-deck-and-user-id", {
          deckId: id,
          userId: userId,
        })
        .then(async (res) => {
          const deleteAuth = res.data;

          //delete all cardStats associated
          api.get(`cards/get_cards/${id}`).then(async (res) => {
            await Promise.all(
              res.data.map(async (item) => {
                await api
                  .post(`card-stats/delete-by-card-and-user-id`, {
                    cardId: item._id,
                    userId: userId,
                    readOnly: false,
                  })
                  .then((res) => {
                    return res.data;
                  });
              })
            );
          });

          if (deleteAuth) {
            await api.post("decks/authenticate-deletion-and-delete", {
              creator: userId,
              id: id,
            });
            //delete all cards associated
            api
              .get(`cards/get_cards/${id}`)
              .then(async (res) => {
                await Promise.all(
                  res.data.map(async (item) => {
                    await api
                      .post(`cards/authenticate-deletion-and-delete`, {
                        id: item._id,
                        creator: userId,
                      })
                      .then((res) => {
                        return res.data;
                      });
                  })
                );
              })
              .then(() => {
                setTimeout(() => router.back(), 500); //small delay before going back just in case
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            setTimeout(() => router.back(), 500); //small delay before going back just in case
          }
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
                        className="bg-red-800 text-white p-2 sm:px-16 rounded-sm text-xl font-bold focus:text-gray-200 
                      focus:bg-red-900 hover:text-gray-200 hover:bg-red-900 outline-none px-2"
                        onClick={() => confirmFunction()}
                      >
                        {t("confirm")}
                      </button>
                      <button
                        className="confirmation-button px-2 sm:px-16"
                        ref={completeButtonRef}
                        onClick={() => setShow}
                      >
                        {t("cancel")}
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

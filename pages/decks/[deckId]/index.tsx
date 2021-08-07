import { useRouter } from "next/router";
import React from "react";
import Navbar from "../../../components/Navbar";
import { NewCardForm } from "../../../components/NewCardForm";

export default function index() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  const { deckId, title } = router.query;

  return (
    <div className="">
      <Navbar />
      <div
        id="container"
        className="flex flex-col justify-center items-center sm:my-8 overflow-scroll"
      >
        <NewCardForm deckId={deckId} />
      </div>
    </div>
  );
}

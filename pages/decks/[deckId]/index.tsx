import { useRouter } from "next/router";
import React from "react";
import CardTable from "../../../components/CardTable";
import Container from "../../../components/Container";
import DeckNavbar from "../../../components/DeckNavbar";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import { NewCardForm } from "../../../components/NewCardForm";

export default function index() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  const { deckId } = router.query;

  return (
    <div className="">
      <Navbar />
      <DeckNavbar deckId={deckId} />
      <div className="flex flex-col justify-start items-center min-h-screen min-w-screen h-full">
        <CardTable deckId={deckId} />
      </div>
      <Footer />
    </div>
  );
}

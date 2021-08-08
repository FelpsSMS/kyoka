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
      <Container>
        <CardTable />
      </Container>
      <Footer />
    </div>
  );
}

import { useRouter } from "next/router";
import React from "react";
import Container from "../../../components/Container";
import Navbar from "../../../components/Navbar";
import { NewCardForm } from "../../../components/NewCardForm";

export default function index() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  const { deckId } = router.query;

  function handleClick(id: any) {
    router.push({
      pathname: `[deckId]/create_card`,
      query: { deckId: id },
    });
  }

  return (
    <div className="">
      <Navbar />
      <Container>
        <button onClick={() => handleClick(deckId)}>Create card page</button>
      </Container>
    </div>
  );
}

import { useRouter } from "next/router";
import Container from "../../../components/Container";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import { NewCardForm } from "../../../components/NewCardForm";

function create_card() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const { deckId } = router.query;

  return (
    <div className="flex flex-col">
      <Navbar />
      <Container>
        <NewCardForm deckId={deckId} />
      </Container>
      <Footer />
    </div>
  );
}

export default create_card;

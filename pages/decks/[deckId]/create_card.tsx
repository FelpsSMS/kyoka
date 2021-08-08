import Container from "../../../components/Container";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import { NewCardForm } from "../../../components/NewCardForm";

function create_card({ deckId }) {
  return (
    <div className="">
      <Navbar />
      <Container>
        <NewCardForm deckId={deckId} />
      </Container>
      <Footer />
    </div>
  );
}

export default create_card;

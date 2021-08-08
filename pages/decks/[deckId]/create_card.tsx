import Container from "../../../components/Container";
import Navbar from "../../../components/Navbar";
import { NewCardForm } from "../../../components/NewCardForm";

function create_card({ deckId }) {
  return (
    <div className="">
      <Navbar />
      <Container>
        <NewCardForm deckId={deckId} />
      </Container>
    </div>
  );
}

export default create_card;

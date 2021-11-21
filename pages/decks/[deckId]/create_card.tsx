import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React from "react";
import Container from "../../../components/Container";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import { NewCardForm } from "../../../components/NewCardForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function CreateCard() {
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["kyoka-token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { ...(await serverSideTranslations(ctx.locale, ["common"])) },
  };
};

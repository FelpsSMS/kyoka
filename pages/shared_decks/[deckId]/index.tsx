import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import CardTable from "../../../components/CardTable";
import Container from "../../../components/Container";
import DeckNavbar from "../../../components/DeckNavbar";
import DeckOptionsNavbar from "../../../components/DeckOptionsNavbar";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import { NewCardForm } from "../../../components/NewCardForm";
import SharedDeckOptionsNavbar from "../../../components/SharedDeckOptionsNavbar";
import { api, verifyToken } from "../../../utils/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function SharedDecksIndex() {
  const router = useRouter();
  const [sorting, setSorting] = useState();
  const [search, setSearch] = useState("");

  const { deckId } = router.query;

  return (
    <div className="">
      <Navbar />

      <div className="flex flex-col justify-start items-center min-h-screen min-w-screen h-full overflow-x-hidden">
        <CardTable
          search={search}
          sorting={sorting}
          deckId={deckId}
          readOnly={true}
        />
      </div>
      <SharedDeckOptionsNavbar deckId={deckId} />
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

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
import { api, verifyToken } from "../../../utils/api";

export default function index() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [sorting, setSorting] = useState();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [search, setSearch] = useState("");

  const { deckId } = router.query;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [readOnly, setReadOnly] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const userId = verifyToken();

    api
      .post("deck-stats/stats", {
        userId: userId,
        deckId: deckId,
      })
      .then((res) => {
        setReadOnly(res.data.readOnly);
      });
  }, []);

  return (
    <div className="">
      <Navbar />
      <DeckNavbar
        deckId={deckId}
        setSorting={setSorting}
        setSearch={setSearch}
        readOnly={readOnly}
      />
      <div className="flex flex-col justify-start items-center min-h-screen min-w-screen h-full overflow-x-hidden">
        <CardTable
          search={search}
          sorting={sorting}
          deckId={deckId}
          readOnly={readOnly}
        />
      </div>
      <DeckOptionsNavbar deckId={deckId} readOnly={readOnly} />
      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["kyoka-token"]: token } = parseCookies(ctx);
  //const apiClient = getAPIClient(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  //await apiClient.get("/users");

  return { props: {} };
};

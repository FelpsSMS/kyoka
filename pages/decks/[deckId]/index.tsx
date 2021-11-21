import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import CardTable from "../../../components/CardTable";
import DeckNavbar from "../../../components/DeckNavbar";
import DeckOptionsNavbar from "../../../components/DeckOptionsNavbar";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import { api, verifyToken } from "../../../utils/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function CreateCardIndex() {
  const router = useRouter();

  const [sorting, setSorting] = useState();
  const [search, setSearch] = useState("");

  const { deckId } = router.query;
  const [readOnly, setReadOnly] = useState(false);

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
  }, [deckId]);

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

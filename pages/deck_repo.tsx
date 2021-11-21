import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React from "react";
import DeckRepo from "../components/DeckRepo";
import Footer from "../components/Footer";

import Navbar from "../components/Navbar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function deck_repo() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <Navbar />
      </div>

      <div className="flex items-center justify-center mx-4">
        <h1 className="font-bold text-3xl">
          Escolha um deck para adicionar à sua biblioteca
        </h1>
      </div>

      <div className="flex flex-col min-h-screen min-w-screen mx-8">
        <DeckRepo />
      </div>

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

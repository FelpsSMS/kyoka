import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React from "react";
import DeckRepo from "../components/DeckRepo";
import Footer from "../components/Footer";
import { useTranslation } from "next-i18next";

import Navbar from "../components/Navbar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

export default function Deck_repo() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-8">
      <Head>
        <title>{t("deck_repo_page_title")}</title>
        <meta name="description" content="Kyoka" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Navbar />
      </div>

      <div className="flex items-center justify-center mx-4">
        <h1 className="font-bold text-3xl">{t("choose_deck_to_add")}</h1>
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
        destination: `/${ctx.locale}`,
        permanent: false,
      },
    };
  }

  return {
    props: { ...(await serverSideTranslations(ctx.locale, ["common"])) },
  };
};

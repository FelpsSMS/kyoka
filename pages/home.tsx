import Image from "next/image";
import Navbar from "../components/Navbar";
import SRSPanel from "../components/SRSPanel";
import React from "react";
import Footer from "../components/Footer";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div
      id="container"
      // className="flex flex-col h-screen w-screen justify-between"
    >
      <Head>
        <title>{t("home_page_title")}</title>
        <meta name="description" content="Kyoka" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Navbar */}
      <Navbar />

      {/* Container */}
      <div className="flex justify-center items-center min-h-screen">
        {/* SRS Panel */}
        <SRSPanel />
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

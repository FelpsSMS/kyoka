import Image from "next/image";
import Navbar from "../components/Navbar";
import SRSPanel from "../components/SRSPanel";
import React from "react";
import Footer from "../components/Footer";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div
      id="container"
      // className="flex flex-col h-screen w-screen justify-between"
    >
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
        destination: "/",
        permanent: false,
      },
    };
  }

  console.log(ctx.locale);

  return {
    props: { ...(await serverSideTranslations(ctx.locale, ["common"])) },
  };
};

import Image from "next/image";
import Navbar from "../components/Navbar";
import SRSPanel from "../components/SRSPanel";
import React from "react";
import Footer from "../components/Footer";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { api } from "../utils/api";
import { getAPIClient } from "../utils/axios";

export default function Home() {
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

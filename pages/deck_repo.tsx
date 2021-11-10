import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import Container from "../components/Container";
import DeckRepo from "../components/DeckRepo";
import Footer from "../components/Footer";
import Library from "../components/Library";
import LibraryNavbar from "../components/LibraryNavbar";
import Navbar from "../components/Navbar";

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

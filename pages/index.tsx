import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React from "react";
import Footer from "../components/Footer";
import { LoginForm } from "../components/LoginForm";
import Head from "next/head";

export default function Login() {
  return (
    <div>
      <Head>
        <title>Kyoka</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginForm />
      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["kyoka-token"]: token } = parseCookies(ctx);
  //const apiClient = getAPIClient(ctx);

  if (token) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  //await apiClient.get("/users");

  return { props: {} };
};

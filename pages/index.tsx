import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React from "react";
import Footer from "../components/Footer";
import { LoginForm } from "../components/LoginForm";

export default function Login() {
  return (
    <div>
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

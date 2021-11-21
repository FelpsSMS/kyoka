import { GetServerSideProps } from "next";
import { parseCookies, setCookie } from "nookies";
import React from "react";
import Footer from "../components/Footer";
import { LoginForm } from "../components/LoginForm";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    const cookies = parseCookies();

    const currentLocale = cookies["NEXT_LOCALE"];

    if (!currentLocale) {
      setCookie(undefined, "NEXT_LOCALE", locale, {
        maxAge: 60 * 60 * 24 * 30, //30 days
        path: "/",
      });
    }
  }, [locale]);

  return (
    <div>
      <Head>
        <title>Kyoka</title>
        <meta name="description" content="Kyoka" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginForm />
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

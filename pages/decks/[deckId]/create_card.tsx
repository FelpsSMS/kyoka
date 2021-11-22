import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React from "react";
import Container from "../../../components/Container";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import { NewCardForm } from "../../../components/NewCardForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function CreateCard() {
  const router = useRouter();
  const { deckId } = router.query;
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <Head>
        <title>{t("create_card_page_title")}</title>
        <meta name="description" content="Kyoka" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Container>
        <NewCardForm deckId={deckId} />
      </Container>
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

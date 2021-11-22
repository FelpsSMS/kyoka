import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import Footer from "../components/Footer";
import Library from "../components/Library";
import LibraryNavbar from "../components/LibraryNavbar";
import Navbar from "../components/Navbar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function LibraryPage() {
  const [sorting, setSorting] = useState();
  const [libraryChanged, setLibraryChanged] = useState("A-Z");
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-8">
      <Head>
        <title>{t("library_page_title")}</title>
        <meta name="description" content="Kyoka" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Navbar />
        <LibraryNavbar
          setSorting={setSorting}
          libraryChanged={libraryChanged}
          setLibraryChanged={setLibraryChanged}
          setSearch={setSearch}
        />
      </div>

      <div className="flex flex-col min-h-screen min-w-screen mx-8">
        <Library
          sorting={sorting}
          libraryChanged={libraryChanged}
          search={search}
        />
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

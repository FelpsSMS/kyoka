import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Library from "../components/Library";
import LibraryNavbar from "../components/LibraryNavbar";
import Navbar from "../components/Navbar";

export default function library() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [sorting, setSorting] = useState();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [libraryChanged, setLibraryChanged] = useState("A-Z");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col space-y-8">
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

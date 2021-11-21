import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function credits() {
  return (
    <div className="">
      <Navbar />

      <div className="flex justify-center items-center min-h-screen">
        <div
          className="bg-white flex flex-col min-h-screen w-screen items-center justify-center sm:rounded-lg 
      sm:shadow-lg sm:my-8 sm:mx-8 md:mx-16 lg:my-16 lg:mx-32"
        >
          <p className="font-bold">
            {"Some sentences and translations are from"}
            <a className="text-blue-300" href="http://tatoeba.org">
              {" Tatoeba"}
            </a>
            {"'s amazing API, released under the"}
            <a
              className="text-blue-300"
              href="http://creativecommons.org/licenses/by/2.0/fr/"
            >
              {" CC-BY License"}
            </a>
          </p>

          <p className="font-bold">
            {"All images used for generating cards automatically come from"}
            <a className="text-blue-300" href="https://www.pexels.com/">
              {" Pexel"}
            </a>
            {"'s repository"}
          </p>
        </div>
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

  return {
    props: { ...(await serverSideTranslations(ctx.locale, ["common"])) },
  };
};

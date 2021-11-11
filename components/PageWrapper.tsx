import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

export default function clipboard({ children }) {
  return (
    <div className="">
      <Navbar />

      <div className="flex justify-center items-center min-h-screen">
        <div
          className="bg-white flex flex-col min-h-screen w-screen items-center justify-center sm:rounded-lg 
            sm:shadow-lg sm:my-8 p-8 sm:mx-8 md:mx-16 lg:my-16 lg:mx-32"
        >
          {children}
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

  return { props: {} };
};

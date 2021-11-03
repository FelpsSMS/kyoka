import { GetServerSideProps } from "next";
import { parseCookies, destroyCookie } from "nookies";

function logout() {
  return <div></div>;
}

export default logout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["kyoka-token"]: token } = parseCookies(ctx);

  if (token) {
    destroyCookie(ctx, "kyoka-token", { path: "/" });

    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

import { GetServerSideProps } from "next";
import { parseCookies, destroyCookie } from "nookies";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function Logout() {
  const { t } = useTranslation();

  return (
    <div>
      <Head>
        <title>{t("logout_page_title")}</title>
        <meta name="description" content="Kyoka" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}

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

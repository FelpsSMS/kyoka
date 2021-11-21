import router, { useRouter } from "next/router";
import { parseCookies, setCookie } from "nookies";
import { useCallback, useEffect, useState, useMemo } from "react";
import Select from "./Select";
import { useTranslation } from "next-i18next";

export default function Footer() {
  const router = useRouter();

  const languages = ["Português", "English", "日本語"];
  const [selectedLanguage, setSelectedLanguage] = useState(0);
  const [isCookieLoaded, setIsCookieLoaded] = useState(false);
  const { t } = useTranslation();

  const reroute = useCallback(
    (newLocale) => {
      const { pathname, asPath, query } = router;

      if (router.locale != newLocale) {
        setCookie(undefined, "NEXT_LOCALE", newLocale, {
          maxAge: 60 * 60 * 24, //1 day
          path: "/",
        });

        router.push({ pathname, query }, asPath, { locale: newLocale });
      }
    },
    [router]
  );

  useEffect(() => {
    const cookies = parseCookies();

    const currentLocale = cookies["NEXT_LOCALE"];

    switch (currentLocale) {
      case "pt":
        setSelectedLanguage(0);
        break;

      case "en":
        setSelectedLanguage(1);
        break;

      case "ja":
        setSelectedLanguage(2);
        break;
    }

    setIsCookieLoaded(true);
  }, []);

  useEffect(() => {
    if (isCookieLoaded) {
      let newLocale = "en";

      switch (+selectedLanguage) {
        case 0:
          newLocale = "pt";
          break;

        case 1:
          newLocale = "en";
          break;

        case 2:
          newLocale = "ja";
          break;
      }

      reroute(newLocale);
    }
  }, [selectedLanguage, isCookieLoaded, reroute]);

  return (
    <div className="flex flex-col justify-between items-center bg-black whitespace-nowrap h-60">
      <Select
        selectedItem={selectedLanguage}
        setSelectedItem={setSelectedLanguage}
        items={languages}
        className="flex w-full justify-center sm:justify-end my-6 sm:px-6"
        className2="px-8 sm:px-16 font-bold bg-white py-2 text-xl w-full focus:outline-none 
        focus:shadow-outline-blue focus:border-blue-300 relative border shadow-sm 
        border-gray-300 rounded text-gray-800"
      />
      <div className="flex flex-col items-center justify-center">
        <p
          className="text-white font-black my-3 hover:text-gray-100 hover:cursor-pointer"
          onClick={() => {
            router.push("credits");
          }}
        >
          {t("credits")}
        </p>
        <p className="text-white font-black my-3">Kyoka - 2021</p>
      </div>
    </div>
  );
}

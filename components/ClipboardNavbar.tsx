import { SearchIcon } from "@heroicons/react/outline";
import router from "next/router";
import React, { useEffect, useState } from "react";
import Select from "./Select";
export default function ClipboardNavbar({}) {
  function handleCardCreation() {}

  const [query, setQuery] = useState("");

  /*   useEffect(() => {
    const timeOutId = setTimeout(() => setSearch(query), 300); //debounce
    return () => clearTimeout(timeOutId);
  }, [query, setSearch]); */

  return (
    <nav className="bg-gray-500 flex justify-center flex-col md:flex-row">
      <div className="flex">
        <button
          className="confirmation-button my-4"
          onClick={() => handleCardCreation()}
        >
          Criar carta
        </button>
      </div>
    </nav>
  );
}

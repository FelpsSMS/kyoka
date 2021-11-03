import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";
import { Fragment, useState } from "react";
import Select from "./Select";

export default function Footer() {
  const languages = ["Português", "English", "日本語"];
  const [selectedLanguage, setSelectedLanguage] = useState(0);

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="bg-black flex justify-center items-top p-6 sm:w-3/5 sm:h-60">
        <p className="text-white font-black">Kyoka - 2021</p>
      </div>

      <div className="flex justify-center sm:justify-end items-top bg-black w-full sm:w-2/5 h-60 ">
        <Select
          selectedItem={selectedLanguage}
          setSelectedItem={setSelectedLanguage}
          items={languages}
          className="flex w-full justify-center sm:justify-end mx-8 my-6"
          className2="px-16 font-bold bg-white py-2 text-xl w-full focus:outline-none 
          focus:shadow-outline-blue focus:border-blue-300 relative border shadow-sm 
          border-gray-300 rounded text-gray-800"
        />
      </div>
    </div>
  );
}

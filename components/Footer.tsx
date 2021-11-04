import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";
import { Fragment, useState } from "react";
import Select from "./Select";

export default function Footer() {
  const languages = ["Português", "English", "日本語"];
  const [selectedLanguage, setSelectedLanguage] = useState(0);

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
      <p className="text-white font-black my-3">Kyoka - 2021</p>
    </div>
  );
}

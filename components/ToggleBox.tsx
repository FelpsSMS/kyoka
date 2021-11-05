import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";

export default function ToggleBox({ title, text }) {
  return (
    <div className="w-full px-4">
      <div className="w-full max-w-md p-2 mx-auto bg-white rounded-2xl">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left 
              text-white bg-gray-900 focus:bg-black hover:bg-black rounded-lg focus:text-gray-200 hover:text-gray-200
              focus:outline-none focus-visible:ring focus-visible:ring-gray-200 focus-visible:ring-opacity-75"
              >
                <span>{title}</span>
                <ChevronUpIcon
                  className={`${
                    open ? "transform rotate-180" : ""
                  } w-5 h-5 text-white`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                {text}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}

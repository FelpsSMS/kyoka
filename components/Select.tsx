import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";
import { Fragment, useEffect, useState } from "react";

interface SelectInterface {
  selectedItem: any;
  setSelectedItem: any;
  items: any[];
  label?: string;
  className?: string;
  className2?: string;
  setSorting?: any;
}

function Select({
  selectedItem,
  setSelectedItem,
  items,
  label,
  className,
  className2,
  setSorting,
}: SelectInterface) {
  useEffect(() => {
    if (items.length > 0) setSelectedItem(Object.keys(items[0])[0]); //weird workaround to make it so headless UI's listbox detects the selection for the first element
  }, []);

  return (
    <Listbox
      as="div"
      value={selectedItem}
      onChange={(value) => {
        setSelectedItem(value);

        if (setSorting) {
          setSorting(value);
        }
      }}
      className={`${className}`}
    >
      {({ open }) => (
        <div>
          <Listbox.Label className="text-white font-black">
            {label}
          </Listbox.Label>
          <div className="relative">
            <span className={`inline-block w-full`}>
              <Listbox.Button className={`${className2}`}>
                <span className="block truncate">{items[selectedItem]}</span>
              </Listbox.Button>
            </span>
            <Transition
              show={open}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="border border-gray-300 rounded mt-1 bg-white mb-10 absolute w-full"
              >
                {Object.keys(items).map((item) => (
                  <Listbox.Option key={item} value={item}>
                    {({ selected, active }) => (
                      <div
                        className={`${
                          active ? "text-white bg-blue-800" : "text-gray-900"
                        } cursor-default select-none relative py-2 pl-10 pr-4`}
                      >
                        <span
                          className={`${
                            selected ? "font-semibold" : "font-normal"
                          }`}
                        >
                          {items[item]}
                        </span>

                        {selected && (
                          <span
                            className={`${
                              active ? "text-white" : "text-blue-800"
                            } absolute inset-y-0 left-0 flex items-center pl-2`}
                          >
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
}

export default Select;

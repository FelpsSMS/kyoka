import { Menu } from "@headlessui/react";
import { MenuIcon } from "@heroicons/react/outline";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useRouter } from "next/router";
import navbarElements from "../utils/navbarElements";

export default function HamburgerMenu() {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button className="hover:border-b-2 hover:font-black focus:font-black focus:border-b-2 h-14 flex justify-center items-center focus:outline-none">
              <MenuIcon className="h-8 text-white" />
            </Menu.Button>
            {open && (
              <Menu.Items
                as={motion.div}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.4 }}
                static
                className="flex flex-col justify-center items-center focus:outline-none"
              >
                {navbarElements.map((item, i) => {
                  return (
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "border-b-2" : ""
                          } text-white p-4 outline-none`}
                          onClick={() => {
                            router.push(item.link);
                          }}
                        >
                          {item.title}
                        </button>
                      )}
                    </Menu.Item>
                  );
                })}
              </Menu.Items>
            )}
          </>
        )}
      </Menu>
    </div>
  );
}

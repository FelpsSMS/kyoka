import React from "react";
import HamburgerMenu from "./HamburgerMenu";
import NavbarItem from "./NavbarItem";
import navbarElements from "../utils/navbarElements";

export default function Navbar() {
  return (
    <div className="">
      <div
        className="hidden sm:flex sm:items-center sm:content-around sm:justify-center sm:space-x-2 sm:font-thin 
      bg-black whitespace-nowrap md:justify-end md:space-x-4 md:font-normal md:p-2 lg:text-lg lg:space-x-6"
      >
        {navbarElements.map((item, i) => {
          return <NavbarItem title={item.title} key={i} link={item.link} />;
        })}
      </div>
      <div className="flex justify-center items-center bg-black sm:hidden">
        <HamburgerMenu />
      </div>
    </div>
  );
}

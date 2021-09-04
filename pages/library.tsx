import React from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Library from "../components/Library";
import LibraryNavbar from "../components/LibraryNavbar";
import Navbar from "../components/Navbar";

export default function library() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <Navbar />
        <LibraryNavbar />
      </div>

      <div className="flex flex-col min-h-screen min-w-screen mx-8">
        <Library />
      </div>

      <Footer />
    </div>
  );
}

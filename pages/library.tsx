import React from "react";
import Footer from "../components/Footer";
import Library from "../components/Library";
import Navbar from "../components/Navbar";

export default function library() {
  return (
    <div className="flex flex-col space-y-4 h-screen">
      <Navbar />

      <Library />

      <Footer />
    </div>
  );
}

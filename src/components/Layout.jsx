import React from "react";
import Routers from "../router/Routers";
import Header from "./Header";
import Feature from "./Landing/Feature";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-400">
      <Header />
      <Routers />
      <Feature />
      <Footer />
    </div>
  );
}

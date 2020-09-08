import React from "react";
import Nav from "./Nav";

const Layout = ({ children }) => {
  return (
    <div className="h-screen w-full flex flex-col">
      <Nav></Nav>
      <main className="flex-grow bg-gray-200 py-8 px-4 md:p-8">{children}</main>
    </div>
  );
};

export default Layout;

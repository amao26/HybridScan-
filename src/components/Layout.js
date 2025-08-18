// src/components/Layout.js
import React from "react";
import MuiSidebar from "./MuiSidebar";
import "../styles.css";

export default function Layout({ children }) {
  return (
    <div className="app">
      <MuiSidebar />
      <div className="main">
        {children}
      </div>
    </div>
  );
}

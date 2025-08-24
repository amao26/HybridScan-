import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="app">
      <Sidebar />
      <main style={{ flex: 1, padding: "20px" }}>
        {children || <Outlet />}
      </main>
    </div>
  );
}

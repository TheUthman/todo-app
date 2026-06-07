import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/layout.css";

export default function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="app-main-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

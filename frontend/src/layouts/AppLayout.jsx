import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Automatically close sidebar when navigating on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-wrapper">
      {/* Mobile Backdrop */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="main-column">
        <Topbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
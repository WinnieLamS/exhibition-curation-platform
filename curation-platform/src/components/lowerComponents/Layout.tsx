import React from "react";
import { Outlet } from "react-router-dom";
import "../../css/Layout.css";

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <header className="header">
        <h1>Exhibition Curation Platform</h1>
      </header>
      <main className="main-content">
        <Outlet /> {/* This renders the current page's content */}
      </main>
      <footer className="footer">
        <p>&copy; 2025 Exhibition Curation Platform</p>
      </footer>
    </div>
  );
};

export default Layout;

import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import "../../css/Layout.css";

const Layout: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  let inactivityTimer: NodeJS.Timeout;

  const resetTimer = () => {
    setIsVisible(true); // Make header and footer visible on activity
    clearTimeout(inactivityTimer); // Clear any existing timer
    inactivityTimer = setTimeout(() => setIsVisible(false), 2000); // Hide after 3 seconds of inactivity
  };

  useEffect(() => {
    // Add event listener for mouse movement
    window.addEventListener("mousemove", resetTimer);

    // Initialize the timer
    resetTimer();

    // Cleanup function to remove event listener and clear timer
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      clearTimeout(inactivityTimer);
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="layout">
      <header className={`header ${!isVisible ? "hidden" : ""}`}>
        <Link to="/" className="header-link">
          <h1>Exhibition Curation Platform</h1>
        </Link>
      </header>
      <main className="main-content">
        <Outlet /> {/* This renders the current page's content */}
      </main>
      <footer className={`footer ${!isVisible ? "hidden" : ""}`}>
        <p>&copy; 2025 Exhibition Curation Platform -- Winnie</p>
      </footer>
    </div>
  );
};

export default Layout;

import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import "../../css/Layout.css";
import { useLoading } from "../../contexts/LoadingContext";
import loadingPink from "../../assets/loadingPink.gif";

const Layout: React.FC = () => {
  const {loading} = useLoading();
  const [isVisible, setIsVisible] = useState(true);
  let inactivityTimer: NodeJS.Timeout;

  const resetTimer = () => {
    setIsVisible(true); 
    clearTimeout(inactivityTimer); 
    inactivityTimer = setTimeout(() => setIsVisible(false), 2000); 
  };

  useEffect(() => {

    window.addEventListener("mousemove", resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      clearTimeout(inactivityTimer);
    };
  }, []);

  return (
    <div className="layout">
      <header className={`header ${!isVisible ? "hidden" : ""}`}>
        <Link to="/" className="header-link">
          <h1>Exhibition Curation Platform</h1>
        </Link>
      </header>

      {loading && (
        <div className="loading_container">
          <h2>Loading......</h2>
          <img src={loadingPink} alt="Loading..." />
        </div>
      )}

      <main className="main-content">
        <Outlet /> 
      </main>
      <footer className={`footer ${!isVisible ? "hidden" : ""}`}>
        <p>&copy; 2025 Exhibition Curation Platform -- Winnie</p>
      </footer>
    </div>
  );
};

export default Layout;

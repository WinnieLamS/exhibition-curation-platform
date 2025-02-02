import { Link } from "react-router-dom";
import React from "react";
import "./../css/HomePage.css";


const HomePage: React.FC = () => {
  
  return (
    <div className="homepage">
    <main className="main-content">
      <div className="image-links">
        <Link to="/met-collection" className="image-container">
          <img
            src="/assets/met.jpeg"
            alt="The Metropolitan Museum of Art Collection"
            className="link-image"
          />
          <div className="overlay">
            <img 
              src="/assets/MetLogo.jpg" 
              alt="The Metropolitan Museum of Art Collection"
              className="overlay-image"/>
          </div>
        </Link>
        <li>The Metropolitan Museum of Art Collection</li>
      </div>
      <div className="image-links">
        <Link to="/harvard-collection" className="image-container">
          <img
            src="/assets/harvard.jpg"
            alt="Harvard Art Museums Collection"
            className="link-image"
          />
          <div className="overlay">
            <img 
              src="/assets/HarvardLogo.jpg" 
              alt="Harvard Art Museums Collection" 
              className="overlay-image"/>
          </div>
        </Link>
          <li>Harvard Art Museums Collection</li>
      </div>
    </main>
  </div>
  
  );
};

export default HomePage;

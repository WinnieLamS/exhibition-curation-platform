import React from "react";
import { Link } from "react-router-dom";
import "./../css/HomePage.css";

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <main className="main-content">
        <div className="image-links">
          <Link to="/harvard-collection" className="image-container">
            <img
              src="/assets/harvard.jpg"
              alt="Harvard Art Museums Collection"
              className="link-image"
            />
            <div className="overlay">
              <img 
                src="/assets/HarvardLogo.jpeg" 
                alt="Harvard Art Museums Collection" 
                className="link-image"/>
            </div>
          </Link>
        </div>
        <div className="image-links">
          <Link to="/met-collection" className="image-container">
            <img
              src="/assets/met.jpeg"
              alt="The Metropolitan Museum of Art Collection"
              className="link-image"
            />
            <div className="overlay">
              <img 
                src="/assets/MetLogo.png" 
                alt="The Metropolitan Museum of Art Collection"
                className="link-image"/>
            </div>
          </Link>
        </div>
        <div className="image-links">
          <Link to="/user-exhibitions" className="image-container">
            <img
              src="/assets/user.png"
              alt="User Exhibitions"
              className="link-image"
            />
            <div className="overlay">User Exhibitions</div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

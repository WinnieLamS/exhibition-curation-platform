// import React, {useState} from "react";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import "./../css/HomePage.css";
import SignInSignUpCard from "./lowerComponents/SignInSignUpCard";


const HomePage: React.FC = () => {
  const { isLoggedIn, user, setUser } = useUser();
  const [showSignInSignUp, setShowSignInSignUp] = useState(false);

  const handleUserPageClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault(); 
      setShowSignInSignUp(true); 
    }
  };
  
  return (
    <div className="homepage">
    <main className="main-content">
      {isLoggedIn ? 
        (
          <Link to="/user-page" className="user-image-container">
            <img
              src={user?.avatar}
              alt="User Page"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              className="user-link-image"
            />
            <div className="overlay">User Page</div>
          </Link> 
        ):(
          <Link
            to="/user-page"
            className="user-image-container"
            onClick={handleUserPageClick}
          >
            <img
              src="/assets/user.png"
              alt="User Page"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              className="user-link-image"
            />
          </Link>
        )}
      <div>
        {user?(
          <h3>Hello {user.username}!</h3>
        ):(
          null
        )}
      </div>
      <hr className="separator-line" />
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
    
    <SignInSignUpCard
      visible={showSignInSignUp}
      onClose={() => setShowSignInSignUp(false)}
      setUser={setUser} 
    />
  </div>
  
  );
};

export default HomePage;

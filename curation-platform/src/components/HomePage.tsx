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
        {isLoggedIn ? 
        (
          <Link to="/user-page" className="image-container">
            <img
              src={user?.avatar}
              alt="User Page"
              className="link-image"
            />
            <div className="overlay">User Page</div>
          </Link> 
        ):(
          <Link
            to="/user-page"
            className="image-container"
            onClick={handleUserPageClick}
          >
            <img
              src="/assets/add.png"
              alt="User Page"
              className="link-image"
            />
            <div className="overlay">User Page</div>
          </Link>
        )}
        </div>
      </main>
      
      <SignInSignUpCard
        visible={showSignInSignUp}
        onClose={() => setShowSignInSignUp(false)}
        setUser={setUser} // Pass the setUser function to update the user state after login
      />
    </div>
  );
};

export default HomePage;

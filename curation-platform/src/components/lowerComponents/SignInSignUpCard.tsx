import React, { useState } from "react";
import "../../css/SignInSignUpCard.css";

interface SignInSignUpCardProps {
  visible: boolean;
  onClose: () => void;
}

const SignInSignUpCard: React.FC<SignInSignUpCardProps> = ({ visible, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  if (!visible) return null; // Don't render the card if it's not visible

  return (
    <div className="backdrop">
      <div className="card">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" placeholder="Enter your password" />
          </div>
          {isSignUp && (
            <div className="form-group">
              <label>Confirm Password:</label>
              <input type="password" placeholder="Confirm your password" />
            </div>
          )}
          <button type="submit" className="submit-btn">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <p>
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(false); }}>
                Sign In
              </a>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(true); }}>
                Sign Up
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default SignInSignUpCard;

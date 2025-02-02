import React, { useState } from "react";
import { signUpUser, signInUser } from "../../firebase/auth"; 
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../../css/SignInSignUpCard.css";
import bunny from "../../assets/avatar/bunny.jpg";

interface SignInSignUpCardProps {
  visible: boolean;
  onClose: () => void;
  setUser: (user: any) => void; 
  setShowLogin?: (show: boolean) => void; 
}


const SignInSignUpCard: React.FC<SignInSignUpCardProps> = ({ 
  visible,
  onClose,
  setUser,
 }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const user = await signUpUser(email, password);
      console.log("User signed up successfully");

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: username,
        avatar: bunny,
        createdAt: new Date(),
      });
      console.log("User data stored in Firestore");

      onClose(); 
      navigate("/user-page"); 
    } catch (err: any) {
      setError(err.message);
    }
  };


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await signInUser(email, password); 
      console.log("User signed in successfully");

      onClose(); 
      setUser(user); 

    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!visible) return null;

  return (
    <div className="backdrop">
      <div className="card">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isSignUp && (
            <>
              <div className="form-group">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Username:</label> 
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          {error && <p className="error">{error}</p>}
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

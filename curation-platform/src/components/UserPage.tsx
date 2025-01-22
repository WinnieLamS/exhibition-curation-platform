import React from "react";
import { useUser } from "../contexts/UserContext";
import { useError } from "../contexts/ErrorContext";

const UserPage: React.FC = () => {
  const { user, setUser } = useUser();
  const { error, setError } = useError();

  const handleLogin = () => {
    // Simulate a login process
    setUser({ id: "1", name: "John Doe", email: "john.doe@example.com" });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      <h1>User Page</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>No user logged in.</p>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default UserPage;

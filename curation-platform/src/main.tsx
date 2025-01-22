import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./contexts/UserContext";
import { ErrorProvider } from "./contexts/ErrorContext";
import "./index.css";
import { LoadingProvider } from "./contexts/LoadingContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LoadingProvider>
      <UserProvider>
        <ErrorProvider>
          <App />
        </ErrorProvider>
      </UserProvider>
    </LoadingProvider>
  </React.StrictMode>
);

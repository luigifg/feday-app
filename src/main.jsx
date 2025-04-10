// src/main.jsx (modificado)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Routes from "./constants/routes.jsx";
import "./Styles/index.css";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </StrictMode>
);
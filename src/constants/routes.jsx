// routes.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../App";
import Admin from "../Admin";
import Events from "../Events";
import SignUp from "../Views/Login/SignUp";
import SignIn from "../Views/Login/SignIn";
import ProtectedRoute from "../constants/ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/events"
          element={<ProtectedRoute element={<Events />} />}
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              element={<Admin />}
              requiredRole="admin"
              redirectTo="/"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

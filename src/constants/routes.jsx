import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../App";
import SignUp from "../Views/SignUp";
import SignIn from "../Views/SignIn";
import Events from "../Views/Events";
import Admin from "../Views/Admin"; // Você precisará criar este componente
import PrivateRoute from "../constants/PrivateRoute";
import AdminRoute from "../constants/AdminRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/events"
          element={<PrivateRoute element={<Events />} />}
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute
              element={
                <AdminRoute element={<Admin />} />
              }
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
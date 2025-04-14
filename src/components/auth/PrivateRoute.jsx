// src/components/PrivateRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";

const PrivateRoute = ({ children }) => {
  if (!auth.currentUser) {
    // Redirect them to the login page if not authenticated
    return <Navigate to="/login" />;
  }

  return children; // Show the children components (Home) if authenticated
};

export default PrivateRoute;

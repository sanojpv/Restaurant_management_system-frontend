
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) return <Navigate to="/login" replace />;

  // if a role is required and it doesn't match
  if (role && storedRole !== role) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;

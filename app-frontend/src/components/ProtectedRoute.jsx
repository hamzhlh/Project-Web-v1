import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("auth_token");
  const isAuth = localStorage.getItem("isAuth");
  if (token || isAuth) {
    return children;
  }
  return <Navigate to="/login" replace />;
}

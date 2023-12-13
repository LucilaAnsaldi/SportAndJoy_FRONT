import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

export const Protected = ({ children }) => {
  const tokeeen = localStorage.getItem("token");

  if (!tokeeen) {
    return <Navigate to="/signin" replace />;
  } else {
    return children;
  }
};

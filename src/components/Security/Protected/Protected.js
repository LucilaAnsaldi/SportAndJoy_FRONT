import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { RoleContext } from "../../../services/role.context";

export const Protected = ({ children }) => {
  const { token } = useContext(RoleContext);

  if (!token) {
    return <Navigate to="/signin" replace />;
  } else {
    return children;
  }
};

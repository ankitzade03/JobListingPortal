import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { SoftContext } from "../../context/SoftContext";


export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, role } = useContext(SoftContext);

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not authorized
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Authorized
  return children;
};

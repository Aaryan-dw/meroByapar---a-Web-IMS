import { Navigate } from "react-router-dom";

function ProtectedRoute({ role, children }) {

  // Read token and user from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 1. Not logged in — redirect to login
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // 2. Wrong role — redirect to unauthorized
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  // 3. All good — show the page
  return children;
}

export default ProtectedRoute;

import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Features from "../pages/Features";
import AdminDashboard from "../pages/AdminDashboard";
import ManagerDashboard from "../pages/ManagerDashboard";
import CashierDashboard from "../pages/CashierDashboard";
import PendingApproval from "../pages/PendingApproval";

// ─── Helper: get current user from storage ───────────────────────────────
const getUser = () => {
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

// ─── ProtectedRoute ───────────────────────────────────────────────────────
// allowedRoles: array of roles that can access this route
function ProtectedRoute({ children, allowedRoles }) {
  const token = getToken();
  const user = getUser();

  // Not logged in at all
  if (!token || !user) return <Navigate to="/login" replace />;

  // Logged in but role not allowed → redirect to the right place
  if (!allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "admin":    return <Navigate to="/admin/dashboard" replace />;
      case "manager":  return <Navigate to="/manager/dashboard" replace />;
      case "cashier":  return <Navigate to="/cashier/dashboard" replace />;
      case "pending":  return <Navigate to="/pending" replace />;
      default:         return <Navigate to="/login" replace />;
    }
  }

  return children;
}

// ─── GuestRoute ─── redirect logged-in users away from login/register ────
function GuestRoute({ children }) {
  const token = getToken();
  const user = getUser();

  if (token && user) {
    switch (user.role) {
      case "admin":    return <Navigate to="/admin/dashboard" replace />;
      case "manager":  return <Navigate to="/manager/dashboard" replace />;
      case "cashier":  return <Navigate to="/cashier/dashboard" replace />;
      case "pending":  return <Navigate to="/pending" replace />;
      default: break;
    }
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />

      {/* Guest only (redirect if already logged in) */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Pending approval - any logged-in user */}
      <Route path="/pending" element={
        <ProtectedRoute allowedRoles={["pending", "admin", "manager", "cashier"]}>
          <PendingApproval />
        </ProtectedRoute>
      } />

      {/* Role-protected dashboards */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/manager/dashboard" element={
        <ProtectedRoute allowedRoles={["manager"]}>
          <ManagerDashboard />
        </ProtectedRoute>
      } />

      <Route path="/cashier/dashboard" element={
        <ProtectedRoute allowedRoles={["cashier"]}>
          <CashierDashboard />
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;

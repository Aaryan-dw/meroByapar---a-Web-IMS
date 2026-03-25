import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ThemeToggle from "../components/Common/ThemeToggle";
import { FaUserCircle, FaSignOutAlt, FaStore, FaEnvelope, FaClock, FaCheckCircle } from "react-icons/fa";

function PendingApproval() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Get user from storage
    const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
    setUser(JSON.parse(stored));

    // Animated dots
    const t = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 600);

    // Keyframes
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
      @keyframes spin{to{transform:rotate(360deg)}}
    `;
    document.head.appendChild(style);

    return () => { obs.disconnect(); clearInterval(t); document.head.removeChild(style); };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const c = (light, dark) => isDark ? dark : light;

  if (!user) return null;

  const steps = [
    { label: "Account Created", done: true, icon: <FaCheckCircle /> },
    { label: "Email Verified", done: user.isVerified, icon: <FaCheckCircle /> },
    { label: "Admin Approval", done: false, icon: <FaClock />, active: true },
    { label: "Access Granted", done: false, icon: <FaCheckCircle /> },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: c("#f3f4f6", "#111827"), display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ position: "absolute", top: 20, right: 20 }}><ThemeToggle /></div>

      <div style={{ width: "100%", maxWidth: "520px", animation: "fadeUp 0.5s ease-out" }}>

        {/* Header Card */}
        <div style={{ backgroundColor: c("white", "#1f2937"), borderRadius: "16px", padding: "32px", marginBottom: "16px", boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)", textAlign: "center" }}>

          {/* Spinner icon */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: "20px" }}>
            <div style={{ width: "80px", height: "80px", border: "3px solid #f3f4f6", borderTopColor: "#f59e0b", borderRadius: "50%", animation: "spin 1.5s linear infinite" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaClock size={28} color="#f59e0b" />
            </div>
          </div>

          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: c("#111827", "white"), marginBottom: "8px" }}>
            Waiting for Approval{dots}
          </h1>
          <p style={{ color: c("#6b7280", "#9ca3af"), fontSize: "0.9rem", lineHeight: 1.6 }}>
            Your account is pending admin review. You'll be able to access your dashboard once the admin assigns your role.
          </p>
        </div>

        {/* Profile Card */}
        <div style={{ backgroundColor: c("white", "#1f2937"), borderRadius: "16px", padding: "24px", marginBottom: "16px", boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)" }}>
          <h3 style={{ fontWeight: "700", color: c("#374151", "#d1d5db"), fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>Your Account</h3>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaUserCircle size={32} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "1.1rem", color: c("#111827", "white") }}>{user.name}</div>
              <div style={{ fontSize: "0.85rem", color: c("#6b7280", "#9ca3af") }}>{user.email}</div>
            </div>
          </div>

          {[
            { icon: <FaEnvelope size={14} />, label: "Email", value: user.email },
            { icon: <FaStore size={14} />, label: "Store", value: user.store_id?.store_name || "Assigned by admin" },
            { icon: <FaClock size={14} />, label: "Status", value: "Pending Approval", accent: "#f59e0b" },
          ].map(({ icon, label, value, accent }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${c("#f3f4f6", "#374151")}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: c("#6b7280", "#9ca3af"), fontSize: "0.85rem" }}>
                {icon} {label}
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: accent || c("#111827", "white") }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Progress Steps */}
        <div style={{ backgroundColor: c("white", "#1f2937"), borderRadius: "16px", padding: "24px", marginBottom: "16px", boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)" }}>
          <h3 style={{ fontWeight: "700", color: c("#374151", "#d1d5db"), fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "20px" }}>Approval Progress</h3>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, position: "relative" }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", top: "14px", left: "50%", width: "100%", height: "2px", backgroundColor: step.done ? "#10b981" : c("#e5e7eb", "#374151"), zIndex: 0 }} />
                )}
                {/* Circle */}
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: step.done ? "#10b981" : step.active ? "#f59e0b" : c("#e5e7eb", "#374151"), display: "flex", alignItems: "center", justifyContent: "center", color: step.done || step.active ? "white" : c("#9ca3af", "#6b7280"), fontSize: "12px", zIndex: 1, animation: step.active ? "pulse 2s ease-in-out infinite" : "none" }}>
                  {step.icon}
                </div>
                <div style={{ fontSize: "0.7rem", color: step.done ? "#10b981" : step.active ? "#f59e0b" : c("#9ca3af", "#6b7280"), fontWeight: step.active ? "700" : "500", marginTop: "6px", textAlign: "center", maxWidth: "70px", lineHeight: 1.3 }}>
                  {step.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info box */}
        <div style={{ backgroundColor: isDark ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.05)", border: "1px solid #f59e0b", borderRadius: "12px", padding: "16px", marginBottom: "16px", fontSize: "0.85rem", color: c("#92400e", "#fbbf24"), lineHeight: 1.6 }}>
          <strong>What happens next?</strong><br />
          The admin will review your account and assign you as a <strong>Manager</strong> or <strong>Cashier</strong>. You'll then be able to log in and access your full dashboard.
        </div>

        {/* Logout button */}
        <button onClick={handleLogout} style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", backgroundColor: "#ef4444", color: "white", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default PendingApproval;

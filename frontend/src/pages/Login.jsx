import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "../components/Common/ThemeToggle";
import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Show success message if redirected from register verify
    if (location.state?.verified) {
      setSuccessMsg("✅ Email verified! Your account is pending admin approval. Login to check status.");
    }

    const style = document.createElement("style");
    style.textContent = `@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`;
    document.head.appendChild(style);
    return () => { obs.disconnect(); document.head.removeChild(style); };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/login`, { email, password });
      const { token, user } = res.data;

      // Store auth data
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", token);
      storage.setItem("user", JSON.stringify(user));

      // Role-based redirect
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "manager":
          navigate("/manager/dashboard");
          break;
        case "cashier":
          navigate("/cashier/dashboard");
          break;
        case "pending":
          navigate("/pending");
          break;
        default:
          navigate("/pending");
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.needsVerification) {
        setError("Your email is not verified yet. Please check your inbox.");
      } else {
        setError(data?.error || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const c = (light, dark) => isDark ? dark : light;

  const containerStyle = {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    backgroundColor: c("#f3f4f6", "#111827"), transition: "all 0.3s", position: "relative", padding: "24px",
  };
  const cardStyle = {
    width: "100%", maxWidth: "400px", padding: "36px", borderRadius: "16px",
    backgroundColor: c("white", "#1f2937"), color: c("#111827", "white"),
    boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(0,0,0,0.08)",
    animation: "fadeUp 0.4s ease-out",
  };
  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: "9px",
    border: `1.5px solid ${c("#e5e7eb", "#374151")}`,
    backgroundColor: c("#f9fafb", "#374151"), color: c("#111827", "white"),
    fontSize: "0.9rem", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };
  const labelStyle = { fontSize: "0.8rem", fontWeight: "700", color: c("#374151", "#d1d5db"), marginBottom: "5px", display: "block", letterSpacing: "0.03em" };
  const btnStyle = {
    width: "100%", padding: "12px", borderRadius: "9px", border: "none",
    backgroundColor: loading ? c("#d1d5db", "#374151") : c("#111827", "white"),
    color: loading ? c("#9ca3af", "#6b7280") : c("white", "#111827"),
    fontSize: "0.95rem", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
    transition: "all 0.2s", marginTop: "8px",
  };

  return (
    <div style={containerStyle}>
      <div style={{ position: "absolute", top: 20, right: 20 }}><ThemeToggle /></div>

      <div style={cardStyle}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: "900", color: c("#111827", "white"), letterSpacing: "-0.5px" }}>MeroByapar</div>
          <div style={{ fontSize: "0.85rem", color: c("#6b7280", "#9ca3af"), marginTop: "4px" }}>Sign in to your account</div>
        </div>

        {successMsg && (
          <div style={{ backgroundColor: isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.08)", border: "1px solid #10b981", color: "#10b981", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "16px", lineHeight: 1.5 }}>
            {successMsg}
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.08)", border: "1px solid #ef4444", color: "#ef4444", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required disabled={loading} placeholder="you@example.com"
              onFocus={e => e.target.style.borderColor = "#3b82f6"}
              onBlur={e => e.target.style.borderColor = c("#e5e7eb", "#374151")} />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required disabled={loading} placeholder="••••••••"
              onFocus={e => e.target.style.borderColor = "#3b82f6"}
              onBlur={e => e.target.style.borderColor = c("#e5e7eb", "#374151")} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", fontSize: "0.85rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer", color: c("#374151", "#d1d5db") }}>
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ accentColor: "#3b82f6" }} />
              Remember me
            </label>
            <Link to="/forgot-password" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: "600" }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "0.85rem", color: c("#6b7280", "#9ca3af"), marginTop: "20px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#3b82f6", fontWeight: "700", textDecoration: "none" }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

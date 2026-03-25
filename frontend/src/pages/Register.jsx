import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/Common/ThemeToggle";
import axios from "axios";
import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState("register"); // "register" | "verify"
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", store_id: "", termsAccepted: false });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Fetch stores for dropdown
    axios.get(`${API}/store`).then(res => {
      setStores(res.data.data || []);
    }).catch(() => {});

    // Add animation keyframes
    const style = document.createElement("style");
    style.textContent = `@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}}`;
    document.head.appendChild(style);
    return () => { obs.disconnect(); document.head.removeChild(style); };
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.termsAccepted) { setError("You must accept the terms & conditions."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (!form.store_id) { setError("Please select your store."); return; }

    setLoading(true);
    try {
      await axios.post(`${API}/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
        store_id: form.store_id,
      });
      setRegisteredEmail(form.email);
      setStep("verify");
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter the full 6-digit code."); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/verify-otp`, { email: registeredEmail, otp: code });
      navigate("/login", { state: { verified: true } });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    try {
      await axios.post(`${API}/resend-otp`, { email: registeredEmail });
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP.");
    }
  };

  const c = (light, dark) => isDark ? dark : light;

  const containerStyle = {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    backgroundColor: c("#f3f4f6", "#111827"), transition: "all 0.3s", position: "relative", padding: "24px",
  };
  const cardStyle = {
    width: "100%", maxWidth: "440px", padding: "36px", borderRadius: "16px",
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
  const btnStyle = (disabled) => ({
    width: "100%", padding: "12px", borderRadius: "9px", border: "none",
    backgroundColor: disabled ? c("#d1d5db", "#374151") : c("#111827", "white"),
    color: disabled ? c("#9ca3af", "#6b7280") : c("white", "#111827"),
    fontSize: "0.95rem", fontWeight: "700", cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s", marginTop: "8px",
  });
  const errStyle = {
    backgroundColor: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.08)",
    border: "1px solid #ef4444", color: "#ef4444", padding: "10px 14px",
    borderRadius: "8px", fontSize: "0.85rem", marginBottom: "16px",
  };

  return (
    <div style={containerStyle}>
      <div style={{ position: "absolute", top: 20, right: 20 }}><ThemeToggle /></div>

      <div style={cardStyle}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: "900", color: c("#111827", "white"), letterSpacing: "-0.5px" }}>MeroByapar</div>
          <div style={{ fontSize: "0.85rem", color: c("#6b7280", "#9ca3af"), marginTop: "4px" }}>
            {step === "register" ? "Create your account" : "Verify your email"}
          </div>
        </div>

        {error && <div style={errStyle}>{error}</div>}

        {/* ── REGISTER STEP ── */}
        {step === "register" && (
          <form onSubmit={handleRegister}>
            {[["name", "Full Name", "text"], ["email", "Email Address", "email"]].map(([name, label, type]) => (
              <div key={name} style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>{label}</label>
                <input name={name} type={type} value={form[name]} onChange={handleChange} style={inputStyle} required disabled={loading}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"}
                  onBlur={e => e.target.style.borderColor = c("#e5e7eb", "#374151")} />
              </div>
            ))}

            {/* Store selection */}
            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Select Your Store</label>
              <select name="store_id" value={form.store_id} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }} required disabled={loading}>
                <option value="">-- Select a store --</option>
                {stores.map(store => (
                  <option key={store._id} value={store._id}>{store.store_name} — {store.address}</option>
                ))}
              </select>
            </div>

            {[["password", "Password (min 6 chars)", "password"], ["confirmPassword", "Confirm Password", "password"]].map(([name, label, type]) => (
              <div key={name} style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>{label}</label>
                <input name={name} type={type} value={form[name]} onChange={handleChange} style={{
                  ...inputStyle,
                  borderColor: name === "confirmPassword" && form.confirmPassword && form.password !== form.confirmPassword ? "#ef4444" : c("#e5e7eb", "#374151")
                }} required disabled={loading}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"}
                  onBlur={e => { if (!(name === "confirmPassword" && form.confirmPassword && form.password !== form.confirmPassword)) e.target.style.borderColor = c("#e5e7eb", "#374151"); }} />
              </div>
            ))}

            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", cursor: "pointer", fontSize: "0.85rem", color: c("#374151", "#d1d5db") }}>
              <input type="checkbox" name="termsAccepted" checked={form.termsAccepted} onChange={handleChange} disabled={loading}
                style={{ width: 16, height: 16, accentColor: "#3b82f6" }} />
              I accept the terms & conditions
            </label>

            <button type="submit" style={btnStyle(loading)} disabled={loading}>
              {loading ? "Creating Account..." : "Create Account →"}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.85rem", color: c("#6b7280", "#9ca3af"), marginTop: "20px" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#3b82f6", fontWeight: "700", textDecoration: "none" }}>Login</Link>
            </p>
          </form>
        )}

        {/* ── OTP VERIFY STEP ── */}
        {step === "verify" && (
          <form onSubmit={handleVerify}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "8px" }}>📧</div>
              <p style={{ color: c("#374151", "#d1d5db"), fontSize: "0.9rem", lineHeight: 1.6 }}>
                We sent a 6-digit code to<br />
                <strong style={{ color: c("#111827", "white") }}>{registeredEmail}</strong>
              </p>
            </div>

            {/* OTP boxes */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "24px" }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  style={{
                    width: "48px", height: "56px", textAlign: "center", fontSize: "1.4rem", fontWeight: "800",
                    borderRadius: "10px", border: `2px solid ${digit ? "#3b82f6" : c("#e5e7eb", "#374151")}`,
                    backgroundColor: c("white", "#374151"), color: c("#111827", "white"), outline: "none",
                  }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"}
                  onBlur={e => { if (!digit) e.target.style.borderColor = c("#e5e7eb", "#374151"); }}
                />
              ))}
            </div>

            <button type="submit" style={btnStyle(loading || otp.join("").length !== 6)} disabled={loading || otp.join("").length !== 6}>
              {loading ? "Verifying..." : "Verify Email →"}
            </button>

            <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.85rem", color: c("#6b7280", "#9ca3af") }}>
              Didn't receive it?{" "}
              <button type="button" onClick={handleResend} disabled={resendCooldown > 0}
                style={{ background: "none", border: "none", cursor: resendCooldown > 0 ? "not-allowed" : "pointer", color: resendCooldown > 0 ? c("#9ca3af", "#6b7280") : "#3b82f6", fontWeight: "700", fontSize: "0.85rem" }}>
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
              </button>
            </div>

            <button type="button" onClick={() => { setStep("register"); setError(""); setOtp(["","","","","",""]); }}
              style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", cursor: "pointer", color: c("#6b7280", "#9ca3af"), fontSize: "0.82rem" }}>
              ← Back to registration
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;

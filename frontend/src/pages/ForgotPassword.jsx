import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/Common/ThemeToggle";
import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // email | otp | reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const style = document.createElement("style");
    style.textContent = `@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`;
    document.head.appendChild(style);
    return () => { obs.disconnect(); document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API}/forgot-password`, { email });
      setStep("otp");
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP.");
    } finally { setLoading(false); }
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const n = [...otp]; n[i] = val.slice(-1); setOtp(n);
    if (val && i < 5) document.getElementById(`fp-otp-${i + 1}`)?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) document.getElementById(`fp-otp-${i - 1}`)?.focus();
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.join("").length !== 6) { setError("Enter the full 6-digit code."); return; }
    setLoading(true);
    try {
      // Verify OTP with backend before allowing password reset step
      await axios.post(`${API}/verify-reset-otp`, { email, otp: otp.join("") });
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired OTP.");
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await axios.post(`${API}/forgot-password`, { email });
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) { setError("Failed to resend."); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/reset-password`, { email, otp: otp.join(""), newPassword });
      navigate("/login", { state: { reset: true } });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password.");
    } finally { setLoading(false); }
  };

  const c = (light, dark) => isDark ? dark : light;
  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: "9px",
    border: `1.5px solid ${c("#e5e7eb", "#374151")}`, backgroundColor: c("#f9fafb", "#374151"),
    color: c("#111827", "white"), fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
  };
  const btnStyle = (disabled) => ({
    width: "100%", padding: "12px", borderRadius: "9px", border: "none",
    backgroundColor: disabled ? c("#d1d5db", "#374151") : c("#111827", "white"),
    color: disabled ? c("#9ca3af", "#6b7280") : c("white", "#111827"),
    fontSize: "0.95rem", fontWeight: "700", cursor: disabled ? "not-allowed" : "pointer", marginTop: "8px",
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: c("#f3f4f6", "#111827"), padding: "24px", position: "relative" }}>
      <div style={{ position: "absolute", top: 20, right: 20 }}><ThemeToggle /></div>

      <div style={{ width: "100%", maxWidth: "400px", padding: "36px", borderRadius: "16px", backgroundColor: c("white", "#1f2937"), boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(0,0,0,0.08)", animation: "fadeUp 0.4s ease-out" }}>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: "900", color: c("#111827", "white") }}>MeroByapar</div>
          <div style={{ fontSize: "0.85rem", color: c("#6b7280", "#9ca3af"), marginTop: "4px" }}>
            {step === "email" ? "Reset your password" : step === "otp" ? "Enter verification code" : "Create new password"}
          </div>
        </div>

        {error && <div style={{ backgroundColor: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.08)", border: "1px solid #ef4444", color: "#ef4444", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "16px" }}>{error}</div>}

        {/* Step 1: Email */}
        {step === "email" && (
          <form onSubmit={handleSendOTP}>
            <p style={{ color: c("#6b7280", "#9ca3af"), fontSize: "0.88rem", marginBottom: "20px", lineHeight: 1.6 }}>
              Enter your registered email and we'll send you a reset code.
            </p>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: "700", color: c("#374151", "#d1d5db"), marginBottom: "5px", display: "block" }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required disabled={loading} placeholder="you@example.com"
                onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = c("#e5e7eb", "#374151")} />
            </div>
            <button type="submit" style={btnStyle(loading)} disabled={loading}>{loading ? "Sending..." : "Send Reset Code →"}</button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOTP}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📨</div>
              <p style={{ color: c("#374151", "#d1d5db"), fontSize: "0.88rem", lineHeight: 1.6 }}>
                Code sent to <strong style={{ color: c("#111827", "white") }}>{email}</strong>
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "24px" }}>
              {otp.map((digit, i) => (
                <input key={i} id={`fp-otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)}
                  style={{ width: "46px", height: "54px", textAlign: "center", fontSize: "1.3rem", fontWeight: "800", borderRadius: "9px", border: `2px solid ${digit ? "#3b82f6" : c("#e5e7eb", "#374151")}`, backgroundColor: c("white", "#374151"), color: c("#111827", "white"), outline: "none" }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => { if (!digit) e.target.style.borderColor = c("#e5e7eb", "#374151"); }} />
              ))}
            </div>
            <button type="submit" style={btnStyle(otp.join("").length !== 6 || loading)} disabled={otp.join("").length !== 6 || loading}>{loading ? "Verifying..." : "Continue →"}</button>
            <div style={{ textAlign: "center", marginTop: "16px", fontSize: "0.85rem", color: c("#6b7280", "#9ca3af") }}>
              <button type="button" onClick={handleResend} disabled={resendCooldown > 0}
                style={{ background: "none", border: "none", cursor: resendCooldown > 0 ? "not-allowed" : "pointer", color: resendCooldown > 0 ? c("#9ca3af", "#6b7280") : "#3b82f6", fontWeight: "700", fontSize: "0.85rem" }}>
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === "reset" && (
          <form onSubmit={handleReset}>
            {[["newPassword", "New Password", setNewPassword, newPassword], ["confirmPassword", "Confirm Password", setConfirmPassword, confirmPassword]].map(([id, label, setter, val]) => (
              <div key={id} style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: c("#374151", "#d1d5db"), marginBottom: "5px", display: "block" }}>{label}</label>
                <input type="password" value={val} onChange={e => setter(e.target.value)} style={inputStyle} required disabled={loading} placeholder="••••••••"
                  onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = c("#e5e7eb", "#374151")} />
              </div>
            ))}
            <button type="submit" style={btnStyle(loading)} disabled={loading}>{loading ? "Resetting..." : "Reset Password →"}</button>
          </form>
        )}

        <p style={{ textAlign: "center", fontSize: "0.85rem", color: c("#6b7280", "#9ca3af"), marginTop: "20px" }}>
          <Link to="/login" style={{ color: "#3b82f6", fontWeight: "700", textDecoration: "none" }}>← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ─── Nodemailer transporter (Gmail SMTP) ───────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail address in .env
    pass: process.env.EMAIL_PASS,   // Gmail App Password in .env
  },
});

// ─── Helper: generate 6-digit OTP ─────────────────────────────────────────
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ─── Helper: send OTP email ───────────────────────────────────────────────
const sendOTPEmail = async (email, otp, name) => {
  await transporter.sendMail({
    from: `"MeroByapar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your MeroByapar Verification Code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#111827;margin-bottom:8px;">Welcome to MeroByapar, ${name}!</h2>
        <p style="color:#6b7280;">Use the verification code below to complete your registration.</p>
        <div style="background:#f3f4f6;border-radius:8px;padding:24px;text-align:center;margin:24px 0;">
          <span style="font-size:2.5rem;font-weight:800;letter-spacing:12px;color:#3b82f6;">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:0.875rem;">This code expires in <strong>10 minutes</strong>.</p>
        <p style="color:#9ca3af;font-size:0.8rem;">If you didn't create a MeroByapar account, ignore this email.</p>
      </div>
    `,
  });
};

// ══════════════════════════════════════════════════════════════════════════
// REGISTER  →  save user as pending + send OTP
// ══════════════════════════════════════════════════════════════════════════
const register = async (req, res) => {
  try {
    const { name, email, password, store_id } = req.body;

    // Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "This email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "pending",        // always starts as pending
      store_id: store_id || null,
      isVerified: false,
      otp,
      otpExpiry,
    });

    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    res.status(201).json({
      message: "Registration successful! Check your email for the verification code.",
      user: {
        user_id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ══════════════════════════════════════════════════════════════════════════
// VERIFY OTP
// ══════════════════════════════════════════════════════════════════════════
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email is already verified." });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ error: "No OTP found. Please register again." });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Incorrect OTP. Please try again." });
    }

    // Mark verified, clear OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully! Your account is pending admin approval.",
      user: {
        user_id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ══════════════════════════════════════════════════════════════════════════
// RESEND OTP
// ══════════════════════════════════════════════════════════════════════════
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });
    if (user.isVerified) return res.status(400).json({ error: "Already verified." });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail(email, otp, user.name);

    res.status(200).json({ message: "New OTP sent to your email." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ══════════════════════════════════════════════════════════════════════════
// LOGIN  →  check isVerified, return role for redirect
// ══════════════════════════════════════════════════════════════════════════
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("store_id", "store_name");
    if (!user) {
      return res.status(401).json({ error: "No account found with this email." });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Your account has been deactivated. Contact admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password. Please try again." });
    }

    // Must verify email first.
    // Skip this check if admin has assigned a real role (not pending).
    // This handles users who didn't verify email but were approved by admin.
    if (!user.isVerified && user.role === 'pending') {
      return res.status(403).json({
        error: 'Please verify your email first.',
        needsVerification: true,
        email: user.email,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        user_id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        isVerified: user.isVerified,
        store_id: user.store_id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ══════════════════════════════════════════════════════════════════════════
// FORGOT PASSWORD
// ══════════════════════════════════════════════════════════════════════════
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "No account with this email." });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
      from: `"MeroByapar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "MeroByapar Password Reset Code",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#111827;">Password Reset</h2>
          <p style="color:#6b7280;">Use this code to reset your password. It expires in 10 minutes.</p>
          <div style="background:#f3f4f6;border-radius:8px;padding:24px;text-align:center;margin:24px 0;">
            <span style="font-size:2.5rem;font-weight:800;letter-spacing:12px;color:#ef4444;">${otp}</span>
          </div>
        </div>
      `,
    });

    res.json({ message: "Password reset code sent to your email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ══════════════════════════════════════════════════════════════════════════
// VERIFY RESET OTP  →  validate OTP without resetting password yet
// ══════════════════════════════════════════════════════════════════════════
const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    if (!user.otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ error: "OTP expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Incorrect OTP. Please try again." });
    }

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ══════════════════════════════════════════════════════════════════════════
// RESET PASSWORD
// ══════════════════════════════════════════════════════════════════════════
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    if (!user.otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ error: "OTP expired. Request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Incorrect OTP." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Password reset successfully. You can now login." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, verifyOTP, resendOTP, login, forgotPassword, verifyResetOTP, resetPassword };

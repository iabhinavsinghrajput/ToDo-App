// routes/auth.js
require("dotenv").config();
const express = require("express");
const router = express.Router(); // ✅ Must define router
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const User = require("../models/User"); // your User model
const SECRET = process.env.JWT_SECRET;

// In-memory OTP storage (replace with DB if needed)
const otps = {};

// ---------------------
// REGISTER + SEND OTP
// ---------------------
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps[email] = otp;

    // send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD }
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP for ToDo App",
      text: `Your OTP is: ${otp}`
    });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------
// VERIFY OTP
// ---------------------
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (otps[email] && otps[email] === otp) {
    delete otps[email]; // OTP used
    return res.json({ message: "OTP verified successfully!" });
  }
  return res.status(400).json({ message: "Invalid OTP" });
});

// ---------------------
// LOGIN
// ---------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid user" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------
// FORGOT PASSWORD
// ---------------------
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetToken = token;
    user.resetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD }
    });

    const link = `http://localhost:5000/reset.html?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset for ToDo App",
      text: `Click here to reset password: ${link}`
    });

    res.json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------
// RESET PASSWORD
// ---------------------
router.post("/reset-password/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; // ✅ Don't forget this!
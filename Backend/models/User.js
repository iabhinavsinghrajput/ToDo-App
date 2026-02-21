const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  verified: { type: Boolean, default: false },
  otp: Number,
  otpExpires: Date,
  resetToken: String,
  resetExpires: Date
});

module.exports = mongoose.model("User", userSchema);
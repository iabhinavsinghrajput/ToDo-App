const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  createdAt: String,
  updatedAt: String
});

module.exports = mongoose.model("Todo", todoSchema);
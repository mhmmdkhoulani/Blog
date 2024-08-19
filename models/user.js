const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  DOB: { type: Date },
  gender: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  profilePic: { type: String },
  isActive: { type: Boolean, default: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

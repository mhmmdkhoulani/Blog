const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Message"],
    minlength: [3, "First  name should be at least 3 char"],
    trim: true,
    validate: {
      validator: function (value) {
        return value.includes("@") ? false : true;
      },
      message: "First name can not include special char",
    },
  },

  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: { type: String, required: true },
  DOB: { type: Date },
  gender: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  profilePic: { type: String },
  isActive: { type: Boolean, default: true, select: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

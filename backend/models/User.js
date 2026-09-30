const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    accountType: {
      type: String,
      enum: ["Student", "Young Professional", "Other"],
      default: "Student",
    },
    profileImage: String,
  },
  { timestamps: true },
);
module.exports = mongoose.model("User", userSchema);

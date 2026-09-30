const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    amount: Number,
    dueDate: Date,
    category: String,
    reminderDays: Number,
    status: { type: String, default: "Upcoming" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Bill", billSchema);

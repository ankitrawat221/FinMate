const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, min: 0, required: true },
    source: { type: String, required: true },
    date: { type: Date, required: true },
    description: String,
    isRecurring: Boolean,
    frequency: String,
    nextDate: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Income", incomeSchema);

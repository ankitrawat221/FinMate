const mongoose = require("mongoose");

const autoPaySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    amount: Number,
    frequency: String,
    nextPaymentDate: Date,
    reminderDays: Number,
    category: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AutoPay", autoPaySchema);

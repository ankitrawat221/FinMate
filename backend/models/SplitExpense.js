const mongoose = require("mongoose");

const splitExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    totalAmount: Number,
    members: [{ name: String, amountOwed: Number, paid: Boolean }],
    splitType: { type: String, default: "equal" },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SplitExpense", splitExpenseSchema);

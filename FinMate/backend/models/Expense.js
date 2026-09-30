const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, min: 0, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    description: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", expenseSchema);

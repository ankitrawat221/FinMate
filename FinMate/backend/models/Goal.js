const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    targetAmount: Number,
    currentAmount: { type: Number, default: 0 },
    targetDate: Date,
    description: String,
    completed: Boolean,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Goal", goalSchema);

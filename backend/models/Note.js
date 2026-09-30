const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    content: String,
    category: String,
    priority: String,
    pinned: Boolean,
    reminderDate: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Note", noteSchema);

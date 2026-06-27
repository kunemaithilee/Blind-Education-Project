const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    courseTitle: { type: String, required: true },
    progress: { type: Number, default: 0 },
    completedLessons: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    status: { type: String, default: "in-progress" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);

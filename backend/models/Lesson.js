const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: { type: String, required: true },
    duration: { type: String, default: "0 min" },
    content: { type: String, required: true },
    order: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);

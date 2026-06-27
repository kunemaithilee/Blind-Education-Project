const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, default: "Beginner" },
    duration: { type: String, default: "0h" },
    lessons: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    description: { type: String, default: "" },
    nextLesson: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);

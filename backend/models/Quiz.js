const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctIndex: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);

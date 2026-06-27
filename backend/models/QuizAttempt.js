const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    answers: [{ selectedIndex: Number, correctIndex: Number }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);

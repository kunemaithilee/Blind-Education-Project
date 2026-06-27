const express = require("express");
const { getQuizzes, getQuizById, submitQuiz } = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getQuizzes);
router.get("/:id", getQuizById);
router.post("/:id/submit", authMiddleware, submitQuiz);

module.exports = router;

const express = require("express");
const {
  getCourses,
  getAudioNotes,
  getQuizzes,
  getSettings,
} = require("../controllers/courseController");

const router = express.Router();

router.get("/", getCourses);
router.get("/audio-notes", getAudioNotes);
router.get("/quizzes", getQuizzes);
router.get("/settings", getSettings);

module.exports = router;

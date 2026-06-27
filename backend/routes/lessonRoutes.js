const express = require("express");
const { getLessons } = require("../controllers/lessonController");

const router = express.Router();

router.get("/", getLessons);

module.exports = router;

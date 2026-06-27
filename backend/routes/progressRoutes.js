const express = require("express");
const { getProgress, saveProgress } = require("../controllers/progressController");

const router = express.Router();

router.get("/", getProgress);
router.post("/", saveProgress);

module.exports = router;

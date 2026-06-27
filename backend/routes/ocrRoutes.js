const express = require("express");
const { readImageText } = require("../controllers/ocrController");

const router = express.Router();

router.post("/read", readImageText);

module.exports = router;

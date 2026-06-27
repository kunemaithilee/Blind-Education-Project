const express = require("express");
const { readImageText } = require("../controllers/ocrController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/read", upload.single("image"), readImageText);

module.exports = router;

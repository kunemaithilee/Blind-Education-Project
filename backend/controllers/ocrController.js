const { extractText } = require("../services/ocrService");
const path = require("path");
const fs = require("fs");

exports.readImageText = async (req, res) => {
  if (req.body && req.body.demo) {
    return res.json({
      text: "This is a demo OCR result. Upload an image file to extract real text from it.",
      confidence: 100,
    });
  }

  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded." });
  }

  const filePath = path.resolve(req.file.path);
  const result = await extractText(filePath);

  fs.unlink(filePath, () => {});

  if (result.error) {
    return res.status(500).json({ error: result.error });
  }

  res.json({
    text: result.text,
    confidence: result.confidence,
    filename: req.file.originalname,
  });
};

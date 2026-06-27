const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");

async function extractText(filePath) {
  const resolved = path.resolve(filePath);

  if (!fs.existsSync(resolved)) {
    return { error: "File not found", text: null };
  }

  try {
    const { data } = await Tesseract.recognize(resolved, "eng", {
      logger: (info) => {
        if (info.status === "recognizing text") return;
      },
    });

    const text = (data.text || "").trim();
    return {
      text: text || "No readable text found in the image.",
      confidence: Math.round(data.confidence),
    };
  } catch (err) {
    return {
      error: `OCR failed: ${err.message}`,
      text: null,
    };
  }
}

module.exports = { extractText };

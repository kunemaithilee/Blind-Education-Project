exports.readImageText = (req, res) => {
  res.json({
    text: "Sample OCR result: This image contains readable educational text. Connect Google Vision later for real extraction.",
  });
};

const Chat = require("../models/Chat");
const { isDbConnected } = require("../config/db");

exports.askAssistant = async (req, res) => {
  const question = String(req.body.question || "").toLowerCase();

  let answer = "I heard your question. I can help explain lessons, open modules, and guide your learning.";

  if (question.includes("gravity")) {
    answer = "Gravity is a force that pulls objects toward each other. On Earth, it pulls things toward the ground.";
  } else if (question.includes("photosynthesis")) {
    answer = "Photosynthesis is how plants use sunlight, water, and carbon dioxide to make food and release oxygen.";
  } else if (question.includes("alkane")) {
    answer = "Alkanes are hydrocarbons with only single bonds. Their general formula is C n H two n plus two.";
  }

  if (isDbConnected() && question) {
    await Chat.create({ question, answer });
  }

  res.json({ answer });
};

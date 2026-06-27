const Chat = require("../models/Chat");
const { isDbConnected } = require("../config/db");
const { getAnswer } = require("../services/openaiService");

exports.askAssistant = async (req, res) => {
  const question = String(req.body.question || "").trim();

  if (!question) {
    return res.json({ answer: "Please ask a question so I can help you." });
  }

  const answer = await getAnswer(question);

  if (isDbConnected()) {
    await Chat.create({ question, answer }).catch(() => {});
  }

  res.json({ answer });
};

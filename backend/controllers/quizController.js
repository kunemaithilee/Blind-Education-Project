const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const { isDbConnected } = require("../config/db");

const fallbackQuizzes = [
  {
    id: 1,
    title: "Chemistry Basics Quiz",
    course: "Science",
    questions: [
      { question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "NaCl", "O2"], correctIndex: 0 },
      { question: "What is the pH of pure water?", options: ["5", "7", "9", "12"], correctIndex: 1 },
      { question: "Which gas do plants absorb?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], correctIndex: 2 },
    ],
  },
  {
    id: 2,
    title: "Physics Sound Quiz",
    course: "Science",
    questions: [
      { question: "What do sound waves travel through?", options: ["Vacuum", "Air only", "A medium", "Light"], correctIndex: 2 },
      { question: "What determines the pitch of a sound?", options: ["Amplitude", "Frequency", "Speed", "Loudness"], correctIndex: 1 },
    ],
  },
  {
    id: 3,
    title: "Grammar Essentials Quiz",
    course: "English",
    questions: [
      { question: "What is a noun?", options: ["An action word", "A naming word", "A describing word", "A connecting word"], correctIndex: 1 },
      { question: "Which is a proper noun?", options: ["city", "London", "river", "mountain"], correctIndex: 1 },
      { question: "What does an adjective describe?", options: ["A verb", "A noun", "An adverb", "A preposition"], correctIndex: 1 },
    ],
  },
];

exports.getQuizzes = async (req, res) => {
  if (isDbConnected()) {
    const dbQuizzes = await Quiz.find().sort({ createdAt: -1 });
    if (dbQuizzes.length) {
      const safe = dbQuizzes.map((q) => {
        const obj = q.toObject();
        obj.questions = obj.questions.map((qn) => ({
          question: qn.question,
          options: qn.options,
        }));
        return obj;
      });
      return res.json(safe);
    }
    await Quiz.insertMany(fallbackQuizzes.map((q) => {
      const { id, ...rest } = q;
      return rest;
    }));
    const seeded = await Quiz.find().sort({ createdAt: -1 });
    const safe = seeded.map((q) => {
      const obj = q.toObject();
      obj.questions = obj.questions.map((qn) => ({
        question: qn.question,
        options: qn.options,
      }));
      return obj;
    });
    return res.json(safe);
  }

  const safe = fallbackQuizzes.map((q) => ({
    ...q,
    questions: q.questions.map((qn) => ({ question: qn.question, options: qn.options })),
  }));
  res.json(safe);
};

exports.submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body;

  if (!quizId || !Array.isArray(answers)) {
    return res.status(400).json({ error: "quizId and answers array required" });
  }

  let quiz;
  if (isDbConnected()) {
    quiz = await Quiz.findById(quizId);
  }

  if (!quiz) {
    quiz = fallbackQuizzes.find((q) => String(q.id) === String(quizId));
  }

  if (!quiz) {
    return res.status(404).json({ error: "Quiz not found" });
  }

  let score = 0;
  const total = quiz.questions.length;
  const results = quiz.questions.map((qn, i) => {
    const selected = answers[i];
    const correct = selected === qn.correctIndex;
    if (correct) score++;
    return {
      question: qn.question,
      correct: qn.options[qn.correctIndex],
      selected: qn.options[selected],
      isCorrect: correct,
    };
  });

  if (isDbConnected() && req.user) {
    await QuizAttempt.create({
      userId: req.user.id,
      quizId: quiz._id || quizId,
      score,
      total,
      answers: answers.map((a, i) => ({
        selectedIndex: a,
        correctIndex: quiz.questions[i].correctIndex,
      })),
    }).catch(() => {});
  }

  res.json({
    score,
    total,
    percentage: Math.round((score / total) * 100),
    results,
  });
};

exports.getQuizById = async (req, res) => {
  const { id } = req.params;

  let quiz;
  if (isDbConnected()) {
    quiz = await Quiz.findById(id);
  }

  if (!quiz) {
    quiz = fallbackQuizzes.find((q) => String(q.id) === String(id));
  }

  if (!quiz) {
    return res.status(404).json({ error: "Quiz not found" });
  }

  const obj = { ...(quiz.toObject ? quiz.toObject() : quiz) };
  obj.questions = obj.questions.map((qn) => ({
    question: qn.question,
    options: qn.options,
  }));

  res.json(obj);
};

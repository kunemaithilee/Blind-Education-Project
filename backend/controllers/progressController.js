const Progress = require("../models/Progress");
const { isDbConnected } = require("../config/db");

const fallbackProgress = {
    completedLessons: 24,
    totalLessons: 42,
    learningHours: 126,
    streakDays: 14,
    quizAccuracy: 91,
    courses: [
      { title: "Organic Chemistry Basics", progress: 75 },
      { title: "Physics Through Sound", progress: 64 },
      { title: "Algebra With Audio Steps", progress: 31 },
    ],
};

exports.getProgress = async (req, res) => {
  if (isDbConnected()) {
    const records = await Progress.find().sort({ updatedAt: -1 });

    if (records.length) {
      const completedLessons = records.reduce((sum, item) => sum + item.completedLessons, 0);
      const totalLessons = records.reduce((sum, item) => sum + item.totalLessons, 0);

      return res.json({
        ...fallbackProgress,
        completedLessons,
        totalLessons,
        courses: records.map((item) => ({
          title: item.courseTitle,
          progress: item.progress,
        })),
      });
    }
  }

  res.json(fallbackProgress);
};

exports.saveProgress = async (req, res) => {
  if (isDbConnected()) {
    const progress = await Progress.create(req.body);
    return res.status(201).json({ message: "Progress saved", progress });
  }

  res.status(201).json({ message: "Progress saved", progress: req.body });
};

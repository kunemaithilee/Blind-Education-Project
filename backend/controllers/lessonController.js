const Lesson = require("../models/Lesson");
const { isDbConnected } = require("../config/db");

const fallbackLessons = [
    {
      id: 1,
      title: "Alkanes and Cycloalkanes",
      course: "Organic Chemistry Basics",
      duration: "22 min",
      content: "Alkanes are organic compounds made from carbon and hydrogen with single bonds only.",
    },
    {
      id: 2,
      title: "Sound waves and vibration",
      course: "Physics Through Sound",
      duration: "18 min",
      content: "Sound waves are vibrations that travel through air, water, or solids.",
    },
];

exports.getLessons = async (req, res) => {
  if (isDbConnected()) {
    const lessons = await Lesson.find().sort({ order: 1 });

    if (lessons.length) {
      return res.json(lessons);
    }

    await Lesson.insertMany(fallbackLessons);
    return res.json(await Lesson.find().sort({ order: 1 }));
  }

  res.json(fallbackLessons);
};

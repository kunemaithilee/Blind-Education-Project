const Course = require("../models/Course");
const { isDbConnected } = require("../config/db");

const courses = [
  {
    id: 1,
    slug: "physics-through-sound",
    title: "Physics Through Sound",
    category: "Science",
    level: "Beginner",
    duration: "4h 20m",
    lessons: 14,
    completed: 9,
    progress: 64,
    description: "Understand motion, force, energy and waves through audio-first explanations.",
    nextLesson: "Sound waves and vibration",
  },
  {
    id: 2,
    slug: "organic-chemistry-basics",
    title: "Organic Chemistry Basics",
    category: "Science",
    level: "Intermediate",
    duration: "6h 10m",
    lessons: 18,
    completed: 13,
    progress: 75,
    description: "Learn compounds, reactions and naming rules with guided voice summaries.",
    nextLesson: "Alkanes and cycloalkanes",
  },
  {
    id: 3,
    slug: "algebra-with-audio-steps",
    title: "Algebra With Audio Steps",
    category: "Math",
    level: "Beginner",
    duration: "5h 45m",
    lessons: 16,
    completed: 5,
    progress: 31,
    description: "Practice equations, variables and expressions with spoken step-by-step logic.",
    nextLesson: "Solving linear equations",
  },
  {
    id: 4,
    slug: "english-grammar-essentials",
    title: "English Grammar Essentials",
    category: "English",
    level: "Beginner",
    duration: "3h 30m",
    lessons: 12,
    completed: 12,
    progress: 100,
    description: "Master parts of speech, sentence structure, and punctuation with audio examples.",
    nextLesson: "",
  },
  {
    id: 5,
    slug: "computer-fundamentals",
    title: "Computer Fundamentals",
    category: "Technology",
    level: "Beginner",
    duration: "4h 0m",
    lessons: 10,
    completed: 3,
    progress: 30,
    description: "Learn about hardware, software, and how computers work through voice-guided lessons.",
    nextLesson: "Operating systems overview",
  },
  {
    id: 6,
    slug: "independent-living-skills",
    title: "Independent Living Skills",
    category: "Life Skills",
    level: "All",
    duration: "2h 45m",
    lessons: 8,
    completed: 1,
    progress: 12,
    description: "Build daily living skills with audio tutorials on organization, budgeting, and communication.",
    nextLesson: "Personal organization",
  },
];

const notes = [
  { id: 1, title: "Organic Chemistry Summary", duration: "8 min", text: "Alkanes are saturated hydrocarbons with single bonds." },
  { id: 2, title: "Physics Wave Notes", duration: "6 min", text: "Sound travels as vibrations through a medium." },
  { id: 3, title: "Algebra Steps", duration: "5 min", text: "Solve linear equations by isolating the variable." },
];

const quizzes = [
  { id: 1, title: "Chemistry Basics Quiz", questions: 10, accuracy: 91, status: "Ready" },
  { id: 2, title: "Physics Sound Quiz", questions: 8, accuracy: 84, status: "Ready" },
  { id: 3, title: "Grammar Essentials Quiz", questions: 12, accuracy: 96, status: "Completed" },
];

exports.getCourses = async (req, res) => {
  if (isDbConnected()) {
    const dbCourses = await Course.find().sort({ createdAt: -1 });

    if (dbCourses.length) {
      return res.json(dbCourses);
    }

    await Course.insertMany(courses);
    return res.json(await Course.find().sort({ createdAt: -1 }));
  }

  res.json(courses);
};

exports.getAudioNotes = (req, res) => {
  res.json(notes);
};

exports.getQuizzes = (req, res) => {
  res.json(quizzes);
};

exports.getSettings = (req, res) => {
  res.json({
    fontSize: "Large",
    speechSpeed: "0.95x",
    highContrast: true,
    screenReaderMode: true,
  });
};

exports.courses = courses;

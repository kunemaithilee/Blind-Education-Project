require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Course = require("./models/Course");
const Lesson = require("./models/Lesson");
const Progress = require("./models/Progress");

const courses = [
  {
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

const lessons = [
  { title: "What is Physics?", course: "Physics Through Sound", duration: "12 min", content: "Physics is the study of matter, energy, and how they interact. It explains everything from why a ball falls to how stars shine.", order: 1 },
  { title: "Motion and Speed", course: "Physics Through Sound", duration: "15 min", content: "Motion is a change in position over time. Speed measures how fast an object moves. Calculate speed by dividing distance by time.", order: 2 },
  { title: "Forces and Newton's Laws", course: "Physics Through Sound", duration: "20 min", content: "A force is a push or pull. Newton's first law says objects at rest stay at rest unless acted upon by a force.", order: 3 },
  { title: "Energy Types", course: "Physics Through Sound", duration: "18 min", content: "Energy comes in many forms: kinetic, potential, thermal, chemical, and more. Energy cannot be created or destroyed, only converted.", order: 4 },
  { title: "Sound waves and vibration", course: "Physics Through Sound", duration: "18 min", content: "Sound waves are vibrations that travel through air, water, or solids. The frequency determines pitch, amplitude determines volume.", order: 5 },
  { title: "Introduction to Organic Chemistry", course: "Organic Chemistry Basics", duration: "20 min", content: "Organic chemistry studies carbon-containing compounds. Carbon can form four bonds, allowing millions of different molecules.", order: 1 },
  { title: "Alkanes and cycloalkanes", course: "Organic Chemistry Basics", duration: "22 min", content: "Alkanes are hydrocarbons with only single bonds. Their general formula is C(n)H(2n+2). Cycloalkanes form ring structures.", order: 2 },
  { title: "Alkenes and Alkynes", course: "Organic Chemistry Basics", duration: "20 min", content: "Alkenes have double bonds, alkynes have triple bonds. These unsaturated hydrocarbons are more reactive than alkanes.", order: 3 },
  { title: "Functional Groups", course: "Organic Chemistry Basics", duration: "25 min", content: "Functional groups are specific atom arrangements that give molecules characteristic properties and reactivity.", order: 4 },
  { title: "Introduction to Algebra", course: "Algebra With Audio Steps", duration: "15 min", content: "Algebra uses letters to represent unknown numbers. A variable is a symbol for a number we don't know yet.", order: 1 },
  { title: "Solving linear equations", course: "Algebra With Audio Steps", duration: "20 min", content: "To solve a linear equation, isolate the variable by performing the same operation on both sides of the equation.", order: 2 },
  { title: "Graphing Equations", course: "Algebra With Audio Steps", duration: "18 min", content: "A graph shows the relationship between variables. The x-axis is horizontal, y-axis is vertical. Plot points to draw the line.", order: 3 },
];

async function seed() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI not set in backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }

  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Lesson.deleteMany({}),
    Progress.deleteMany({}),
  ]);
  console.log("Cleared existing data");

  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await User.create({
    name: "Alex",
    email: "alex@example.com",
    password: hashedPassword,
    role: "student",
  });
  console.log(`Created demo user: alex@example.com / password123 (id: ${user._id})`);

  await Course.insertMany(courses);
  console.log(`Seeded ${courses.length} courses`);

  await Lesson.insertMany(lessons);
  console.log(`Seeded ${lessons.length} lessons`);

  const progressRecords = [
    { userId: user._id, courseTitle: "Physics Through Sound", progress: 64, completedLessons: 9, totalLessons: 14, status: "in-progress" },
    { userId: user._id, courseTitle: "Organic Chemistry Basics", progress: 75, completedLessons: 13, totalLessons: 18, status: "in-progress" },
    { userId: user._id, courseTitle: "Algebra With Audio Steps", progress: 31, completedLessons: 5, totalLessons: 16, status: "in-progress" },
    { userId: user._id, courseTitle: "English Grammar Essentials", progress: 100, completedLessons: 12, totalLessons: 12, status: "completed" },
    { userId: user._id, courseTitle: "Computer Fundamentals", progress: 30, completedLessons: 3, totalLessons: 10, status: "in-progress" },
    { userId: user._id, courseTitle: "Independent Living Skills", progress: 12, completedLessons: 1, totalLessons: 8, status: "in-progress" },
  ];

  await Progress.insertMany(progressRecords);
  console.log(`Seeded ${progressRecords.length} progress records`);

  await mongoose.disconnect();
  console.log("\nSeed complete. Demo credentials: alex@example.com / password123");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

import { apiGet, apiPost } from "./api";

export const fallbackNotes = [
  { id: 1, title: "Organic Chemistry Summary", duration: "8 min", text: "Alkanes are saturated hydrocarbons with single bonds." },
  { id: 2, title: "Physics Wave Notes", duration: "6 min", text: "Sound travels as vibrations through a medium." },
];

export const fallbackQuizzes = [
  { id: 1, title: "Chemistry Basics Quiz", questions: 10, accuracy: 91, status: "Ready" },
  { id: 2, title: "Physics Sound Quiz", questions: 8, accuracy: 84, status: "Ready" },
];

export function getAudioNotes() {
  return apiGet("/courses/audio-notes", fallbackNotes);
}

export function getQuizzes() {
  return apiGet("/courses/quizzes", fallbackQuizzes);
}

export function getLessons() {
  return apiGet("/lessons", []);
}

export function getProgress() {
  return apiGet("/progress", {
    completedLessons: 24,
    totalLessons: 42,
    learningHours: 126,
    streakDays: 14,
    quizAccuracy: 91,
    courses: [],
  });
}

export function getSettings() {
  return apiGet("/courses/settings", {
    fontSize: "Large",
    speechSpeed: "0.95x",
    highContrast: true,
    screenReaderMode: true,
  });
}

export function readImageText(payload) {
  return apiPost("/ocr/read", payload, {
    text: "Sample OCR result: text from image will be spoken here.",
  });
}

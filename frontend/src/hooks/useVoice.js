import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { askAssistant } from "../services/aiService";
import { getSpeechRecognition, speak, stopSpeaking } from "../utils/speech";

const commandList = [
  {
    match: ["go home", "open home", "home", "dashboard home"],
    response: "Opening home dashboard. This page has your voice assistant, stats, learning cards, activity, and accessibility actions.",
    path: "/",
  },
  {
    match: ["open dashboard", "go to dashboard", "dashboard"],
    response: "Opening dashboard. This is your main EchoLearn control center.",
    path: "/dashboard",
  },
  {
    match: ["go to courses", "open courses", "show courses", "courses"],
    response: "Opening courses. You can browse subjects, filter categories, and continue lessons.",
    path: "/courses",
  },
  {
    match: ["open audio notes", "audio notes", "read notes", "notes"],
    response: "Opening audio notes. You can listen to saved summaries and study notes.",
    path: "/audio-notes",
  },
  {
    match: ["open quizzes", "start quiz", "start quizzes", "quizzes", "quiz"],
    response: "Opening quizzes. You can practice with sound based questions.",
    path: "/quizzes",
  },
  {
    match: ["open assistant", "go to assistant", "ai assistant", "ask question", "assistant"],
    response: "Opening the AI assistant. Ask a question and I will speak the answer.",
    path: "/assistant",
  },
  {
    match: ["open progress", "show progress", "my progress", "progress"],
    response: "Opening your progress. You can review completed lessons, streak, hours, and quiz accuracy.",
    path: "/progress",
  },
  {
    match: ["open lesson", "read lesson", "lesson"],
    response: "Opening the lesson player. You can listen to lesson content aloud.",
    path: "/lesson",
  },
  {
    match: ["open ocr", "read image", "ocr", "image reader"],
    response: "Opening the OCR reader. You can read image text aloud.",
    path: "/ocr",
  },
  {
    match: ["login", "go to login", "open login"],
    response: "Opening login.",
    path: "/login",
  },
  {
    match: ["register", "sign up", "open register"],
    response: "Opening registration.",
    path: "/register",
  },
  {
    match: ["settings", "open settings", "accessibility settings"],
    response: "Opening settings. You can review font size, speech speed, high contrast, and screen reader mode.",
    path: "/settings",
  },
];

const pageDescriptions = {
  "/": "You are on the home dashboard. Say open courses, read notes, start quiz, show progress, open OCR, or ask a question.",
  "/dashboard": "You are on the dashboard. This page shows the main learning overview.",
  "/courses": "You are on courses. Say open physics, open chemistry, show science courses, or read lesson.",
  "/audio-notes": "You are on audio notes. Use the listen buttons or say read notes.",
  "/quizzes": "You are on quizzes. Say start quiz to practice.",
  "/assistant": "You are on the AI assistant. Ask a question like, what is gravity?",
  "/progress": "You are on progress. This page shows lessons, hours, streak and accuracy.",
  "/lesson": "You are on the lesson player. Use read aloud to hear lesson content.",
  "/ocr": "You are on the OCR reader. Use read sample image to hear extracted text.",
  "/login": "You are on login.",
  "/register": "You are on registration.",
  "/settings": "You are on settings. This page shows accessibility controls.",
};

const courseModuleCommands = [
  { match: ["physics", "physics through sound", "sound waves"], title: "Physics Through Sound", path: "/courses?course=physics-through-sound" },
  { match: ["organic chemistry", "chemistry", "alkanes", "cycloalkanes"], title: "Organic Chemistry Basics", path: "/courses?course=organic-chemistry-basics" },
  { match: ["algebra", "audio steps", "linear equations"], title: "Algebra With Audio Steps", path: "/courses?course=algebra-with-audio-steps" },
  { match: ["english grammar", "grammar", "english"], title: "English Grammar Essentials", path: "/courses?course=english-grammar-essentials" },
  { match: ["computer fundamentals", "computer", "technology"], title: "Computer Fundamentals", path: "/courses?course=computer-fundamentals" },
  { match: ["independent living", "living skills", "life skills"], title: "Independent Living Skills", path: "/courses?course=independent-living-skills" },
];

const courseCategoryCommands = [
  { match: ["science courses", "open science", "show science"], category: "Science" },
  { match: ["math courses", "open math", "show math", "mathematics"], category: "Math" },
  { match: ["english courses", "open english", "show english"], category: "English" },
  { match: ["technology courses", "open technology", "show technology"], category: "Technology" },
  { match: ["life skills courses", "open life skills", "show life skills"], category: "Life Skills" },
];

const FATAL_ERRORS = ["not-allowed", "service-not-allowed", "audio-capture"];

function normalizeCommand(command) {
  return command.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

function findCommand(transcript) {
  const normalized = normalizeCommand(transcript);
  return commandList.find((command) =>
    command.match.some((phrase) => normalized.includes(phrase))
  );
}

function findCourseModuleCommand(transcript) {
  const normalized = normalizeCommand(transcript);
  return courseModuleCommands.find((course) =>
    course.match.some((phrase) => normalized.includes(phrase))
  );
}

function findCourseCategoryCommand(transcript) {
  const normalized = normalizeCommand(transcript);
  return courseCategoryCommands.find((category) =>
    category.match.some((phrase) => normalized.includes(phrase))
  );
}

function extractQuestion(transcript) {
  return normalizeCommand(transcript)
    .replace(/^hey assistant\s*/, "")
    .replace(/^assistant\s*/, "")
    .replace(/^ask question\s*/, "")
    .replace(/^ask\s*/, "")
    .replace(/^explain\s*/, "explain ")
    .trim();
}

function isAssistantQuestion(transcript) {
  const normalized = normalizeCommand(transcript);
  if (["assistant", "ai assistant", "open assistant", "go to assistant", "ask question"].includes(normalized)) {
    return false;
  }
  return (
    normalized.startsWith("hey assistant") ||
    normalized.startsWith("assistant ") ||
    normalized.startsWith("ask about ") ||
    normalized.startsWith("ask echo ") ||
    normalized.startsWith("explain ") ||
    normalized.startsWith("what ") ||
    normalized.startsWith("who ") ||
    normalized.startsWith("why ") ||
    normalized.startsWith("how ") ||
    normalized.startsWith("tell me ")
  );
}

function getRecognitionErrorMessage(error) {
  if (error === "not-allowed" || error === "service-not-allowed") {
    return "Microphone permission is blocked. Please allow microphone access in your browser settings, then click Mic again.";
  }
  if (error === "audio-capture") {
    return "No microphone was found. Please connect or enable your microphone, then click Mic again.";
  }
  if (error === "network") {
    return "Speech recognition service is not reachable. Please check your internet connection and try again.";
  }
  if (error === "language-not-supported") {
    return "This speech language is not supported by your browser.";
  }
  return "I could not understand. Please try again.";
}

export function useVoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const recognitionRef = useRef(null);
  const isRecognitionActiveRef = useRef(false);
  const shouldKeepListeningRef = useRef(false);
  const restartTimerRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const lastSpokenRef = useRef("Welcome to EchoLearn. Say a command like go to courses, open assistant, show progress, repeat, or stop.");
  const [isVoiceModeOn, setIsVoiceModeOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState(lastSpokenRef.current);
  const [error, setError] = useState("");

  const isSupported = useMemo(() => Boolean(getSpeechRecognition()), []);

  const scheduleRestart = useCallback(() => {
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    restartTimerRef.current = setTimeout(() => {
      startListeningRef.current();
    }, 350);
  }, []);

  const say = useCallback((message) => {
    lastSpokenRef.current = message;
    setReply(message);
    const shouldResume = shouldKeepListeningRef.current;

    if (shouldResume && recognitionRef.current && isRecognitionActiveRef.current) {
      isSpeakingRef.current = true;
      try { recognitionRef.current.stop(); } catch {}
    }

    speak(message, () => {
      isSpeakingRef.current = false;
      if (shouldKeepListeningRef.current) {
        scheduleRestart();
      }
    });
  }, [scheduleRestart]);

  const startListeningRef = useRef(() => {});

  const handleCommand = useCallback(
    async (spokenText) => {
      const normalized = normalizeCommand(spokenText);
      setError("");

      if (!normalized) {
        say("I did not hear a command. Please try again.");
        return;
      }

      if (normalized.includes("stop")) {
        shouldKeepListeningRef.current = false;
        isSpeakingRef.current = false;
        setIsVoiceModeOn(false);
        stopSpeaking();
        if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch {}
        }
        isRecognitionActiveRef.current = false;
        setIsListening(false);
        setReply("Listening stopped.");
        return;
      }

      if (normalized.includes("repeat")) {
        say(lastSpokenRef.current);
        return;
      }

      if (normalized.includes("go back") || normalized.includes("previous page")) {
        navigate(-1);
        say("Going back to the previous page.");
        return;
      }

      if (normalized.includes("where am i") || normalized.includes("read page") || normalized.includes("describe page")) {
        say(pageDescriptions[location.pathname] || "You are inside EchoLearn. Say help for available commands.");
        return;
      }

      if (normalized.includes("help") || normalized.includes("commands")) {
        say("I am available on every page. Say open dashboard, go to courses, open physics, open organic chemistry, read notes, start quiz, show progress, read lesson, open OCR, open assistant, login, register, settings, where am I, go back, repeat, or stop. You can also ask a question, for example: hey assistant, what is gravity?");
        return;
      }

      const command = findCommand(spokenText);
      if (command) {
        navigate(command.path);
        say(command.response);
        return;
      }

      if (isAssistantQuestion(spokenText)) {
        const question = extractQuestion(spokenText);
        setReply("Thinking about your question.");
        const answer = await askAssistant(question);
        say(answer);
        return;
      }

      const courseModule = findCourseModuleCommand(spokenText);
      if (courseModule) {
        navigate(courseModule.path);
        say(`Opening ${courseModule.title}.`);
        return;
      }

      const courseCategory = findCourseCategoryCommand(spokenText);
      if (courseCategory) {
        navigate(`/courses?category=${encodeURIComponent(courseCategory.category)}`);
        say(`Opening ${courseCategory.category} courses.`);
        return;
      }

      say(`I heard ${spokenText}, but I do not know that command yet. Say help to hear available commands.`);
    },
    [location.pathname, navigate, say]
  );

  const startListening = useCallback(() => {
    if (isRecognitionActiveRef.current) return;

    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
    }

    shouldKeepListeningRef.current = true;
    setIsVoiceModeOn(true);
    isSpeakingRef.current = false;
    setError("");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isRecognitionActiveRef.current = true;
      setError("");
      setIsListening(true);
      setReply("Microphone is on. Say a command anytime.");
    };

    recognition.onresult = (event) => {
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        if (event.results[index].isFinal) {
          const spokenText = event.results[index][0].transcript;
          setTranscript(spokenText);
          handleCommand(spokenText);
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") return;
      if (event.error === "no-speech") {
        setError("");
        return;
      }

      const message = getRecognitionErrorMessage(event.error);
      setError(message);

      if (FATAL_ERRORS.includes(event.error)) {
        shouldKeepListeningRef.current = false;
        setIsVoiceModeOn(false);
        setIsListening(false);
        isRecognitionActiveRef.current = false;
        setReply(message);
        return;
      }

      setIsListening(false);
      isRecognitionActiveRef.current = false;
      say(message);
    };

    recognition.onend = () => {
      isRecognitionActiveRef.current = false;
      setIsListening(false);

      if (shouldKeepListeningRef.current && !isSpeakingRef.current) {
        scheduleRestart();
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError("Could not start microphone. Please refresh and try again.");
      shouldKeepListeningRef.current = false;
      setIsVoiceModeOn(false);
    }
  }, [handleCommand, say, scheduleRestart]);

  startListeningRef.current = startListening;

  useEffect(() => {
    if (!isSupported) return;
    const timer = setTimeout(() => startListening(), 500);
    return () => clearTimeout(timer);
  }, [isSupported, startListening]);

  const stopListening = useCallback(() => {
    shouldKeepListeningRef.current = false;
    isSpeakingRef.current = false;
    setIsVoiceModeOn(false);
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    isRecognitionActiveRef.current = false;
    setIsListening(false);
  }, []);

  const speakWelcome = useCallback(() => {
    say(lastSpokenRef.current);
  }, [say]);

  return {
    error,
    isListening,
    isSupported,
    isVoiceModeOn,
    reply,
    startListening,
    stopListening,
    transcript,
    speakWelcome,
  };
}

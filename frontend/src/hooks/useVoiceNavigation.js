import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  isRecognitionSupported,
  isSpeechSupported,
  speak,
  startListening as startSpeechRecognition,
  stopListening as stopSpeechRecognition,
} from "../services/speech";

const COMMANDS = [
  {
    phrases: ["go to courses", "open courses", "show courses", "courses page", "courses"],
    response: "Opening courses page.",
    path: "/courses",
  },
  {
    phrases: ["go to lessons", "open lessons", "show lessons", "lessons"],
    response: "Opening lessons.",
    path: "/lesson",
  },
  {
    phrases: ["go to dashboard", "open dashboard", "show dashboard", "dashboard"],
    response: "Opening dashboard.",
    path: "/dashboard",
  },
  {
    phrases: ["go to home", "open home", "go home", "home page"],
    response: "Opening home.",
    path: "/",
  },
];

function normalize(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

function findCommand(transcript) {
  const normalized = normalize(transcript);
  return COMMANDS.find((cmd) =>
    cmd.phrases.some((phrase) => normalized.includes(phrase))
  );
}

function getErrorMessage(error) {
  if (error === "NOT_SUPPORTED") {
    return "Speech recognition is not supported in this browser.";
  }
  if (error === "not-allowed" || error === "service-not-allowed") {
    return "Microphone access is blocked. Please allow microphone permissions.";
  }
  if (error === "audio-capture") {
    return "No microphone found. Please connect a microphone.";
  }
  if (error === "network") {
    return "Speech recognition service unreachable. Check your internet connection.";
  }
  if (error === "language-not-supported") {
    return "This language is not supported by speech recognition.";
  }
  return "Voice recognition encountered an error. Please try again.";
}

const WELCOME_MESSAGE =
  "Voice navigation is active. You can say: Go to Courses, Go to Lessons, Go to Dashboard, Go Back, Repeat, or Stop.";

export function useVoiceNavigation() {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const isActiveRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const mountedRef = useRef(true);
  const restartTimerRef = useRef(null);
  const lastReplyRef = useRef(WELCOME_MESSAGE);
  const startVoiceNavRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const supported = isRecognitionSupported() && isSpeechSupported();

  const stopVoiceNav = useCallback(() => {
    isActiveRef.current = false;
    isSpeakingRef.current = false;
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    if (recognitionRef.current) {
      stopSpeechRecognition(recognitionRef.current);
      recognitionRef.current = null;
    }
    setIsListening(false);
    setStatus("idle");
  }, []);

  const say = useCallback((text, done) => {
    lastReplyRef.current = text;
    if (isActiveRef.current && recognitionRef.current) {
      isSpeakingRef.current = true;
      stopSpeechRecognition(recognitionRef.current);
    }
    speak(text, () => {
      isSpeakingRef.current = false;
      if (done) done();
      if (isActiveRef.current && startVoiceNavRef.current && mountedRef.current) {
        restartTimerRef.current = setTimeout(() => {
          if (isActiveRef.current && startVoiceNavRef.current && mountedRef.current) {
            startVoiceNavRef.current();
          }
        }, 300);
      }
    });
  }, []);

  const handleResult = useCallback(
    (transcript) => {
      const normalized = normalize(transcript);
      setError("");

      if (!normalized) {
        say("I did not hear a command. Please try again.");
        return;
      }

      if (normalized.includes("stop")) {
        stopVoiceNav();
        return;
      }

      if (normalized.includes("repeat")) {
        say(lastReplyRef.current);
        return;
      }

      if (normalized.includes("go back") || normalized.includes("previous") || normalized.includes("back")) {
        navigate(-1);
        say("Going back.");
        return;
      }

      const command = findCommand(transcript);
      if (command) {
        navigate(command.path);
        say(command.response);
        return;
      }

      say(
        `I heard "${transcript}", but I don't know that command. Try: Go to Courses, Go to Lessons, Go to Dashboard, Go Back, Repeat, or Stop.`
      );
    },
    [navigate, say, stopVoiceNav]
  );

  const startVoiceNav = useCallback(() => {
    if (!mountedRef.current) return;
    if (recognitionRef.current) return;

    isActiveRef.current = true;

    const recognition = startSpeechRecognition({
      onStart: () => {
        if (!mountedRef.current) return;
        setIsListening(true);
        setStatus("listening");
        setError("");
      },
      onResult: (transcript) => {
        if (!mountedRef.current) return;
        handleResult(transcript);
      },
      onError: (err) => {
        if (!mountedRef.current) return;
        const message = getErrorMessage(err);
        setError(message);
        setStatus("error");
      },
      onEnd: () => {
        recognitionRef.current = null;
        if (!mountedRef.current) return;
        setIsListening(false);
        setStatus("idle");
        if (isActiveRef.current && !isSpeakingRef.current) {
          restartTimerRef.current = setTimeout(() => {
            if (isActiveRef.current && mountedRef.current) {
              startVoiceNavRef.current?.();
            }
          }, 350);
        }
      },
    });

    if (!recognition) {
      if (mountedRef.current) {
        setError("Speech recognition could not start.");
        setStatus("error");
      }
      return;
    }

    recognitionRef.current = recognition;
    say(WELCOME_MESSAGE);
  }, [handleResult, say]);

  startVoiceNavRef.current = startVoiceNav;

  useEffect(() => {
    mountedRef.current = true;

    if (!supported) {
      setError("Voice navigation is not supported in this browser. Please use Chrome or Edge.");
      setStatus("error");
      return;
    }

    return () => {
      mountedRef.current = false;
      isActiveRef.current = false;
      stopVoiceNav();
    };
  }, [supported, stopVoiceNav]);

  return {
    isListening,
    status,
    error,
    supported,
    startVoiceNav,
    stopVoiceNav,
    speak: say,
  };
}

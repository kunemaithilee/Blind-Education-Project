const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export function isSpeechSupported() {
  return "speechSynthesis" in window;
}

export function isRecognitionSupported() {
  return Boolean(SpeechRecognitionAPI);
}

export function speak(text, onEnd) {
  if (!isSpeechSupported()) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.95;
  utterance.pitch = 1;

  utterance.onend = () => { if (onEnd) onEnd(); };
  utterance.onerror = () => { if (onEnd) onEnd(); };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function startListening({ onResult, onError, onStart, onEnd } = {}) {
  if (!SpeechRecognitionAPI) {
    if (onError) onError("NOT_SUPPORTED");
    return null;
  }

  const recognition = new SpeechRecognitionAPI();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  if (onStart) {
    recognition.onstart = onStart;
  }

  if (onResult) {
    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          onResult(event.results[i][0].transcript);
        }
      }
    };
  }

  if (onError) {
    recognition.onerror = (event) => {
      if (event.error !== "aborted" && event.error !== "no-speech") {
        onError(event.error);
      }
    };
  }

  if (onEnd) {
    recognition.onend = onEnd;
  }

  try {
    recognition.start();
  } catch {
    return null;
  }

  return recognition;
}

export function stopListening(recognition) {
  if (recognition) {
    try {
      recognition.stop();
    } catch {
    }
  }
}

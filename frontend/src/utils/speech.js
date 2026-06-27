export function speak(text, onEnd) {
  if (!("speechSynthesis" in window)) {
    if (onEnd) {
      onEnd();
    }
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.onend = () => {
    if (onEnd) {
      onEnd();
    }
  };
  utterance.onerror = () => {
    if (onEnd) {
      onEnd();
    }
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

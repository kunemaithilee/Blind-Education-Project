import { useCallback, useEffect, useRef } from "react";
import { useVoiceContext } from "../../context/VoiceContext";

function VoiceAssistant() {
  const {
    error,
    isListening,
    isSupported,
    isVoiceModeOn,
    startListening,
    stopListening,
  } = useVoiceContext();

  const isActive = isVoiceModeOn;
  const toggleRef = useRef(() => {});

  const toggle = useCallback(() => {
    if (isActive) {
      stopListening();
    } else {
      startListening();
    }
  }, [isActive, startListening, stopListening]);

  toggleRef.current = toggle;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.altKey && e.key.toLowerCase() === "v") {
        e.preventDefault();
        toggleRef.current();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!isSupported) {
    return (
      <section className="global-voice" aria-label="Voice assistant">
        <div className="global-voice-text">
          <strong style={{ color: "#f87171" }}>Not Supported</strong>
          <span>Use Chrome or Edge for voice navigation.</span>
        </div>
      </section>
    );
  }

  const statusLabel = isListening ? "Listening" : error ? "Error" : "Not Listening";
  const statusColor = isListening ? "#22d3ee" : error ? "#f87171" : "#6b7280";

  return (
    <section className="global-voice" aria-label="Voice assistant" aria-live="polite">
      <button
        className={`global-voice-button ${isActive ? "active" : ""}`}
        onClick={toggle}
        aria-label={isActive ? "Stop voice navigation" : "Start voice navigation"}
        style={{ minHeight: "44px", padding: "0 14px", gap: "8px" }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: statusColor,
            display: "inline-block",
            boxShadow: isListening ? `0 0 8px ${statusColor}` : "none",
            transition: "all 0.2s",
          }}
        />
        {isActive ? "Stop" : "Mic"}
      </button>

      <div className="global-voice-text">
        <strong style={{ color: statusColor }}>
          {statusLabel}
        </strong>
        {error ? (
          <span style={{ color: "#f87171" }}>{error}</span>
        ) : isListening ? (
          <span>Say: "Go to Courses", "Go Back", "Repeat", or "Stop"</span>
        ) : (
          <span>Press Start Voice or Alt+V, then speak commands.</span>
        )}
      </div>
    </section>
  );
}

export default VoiceAssistant;

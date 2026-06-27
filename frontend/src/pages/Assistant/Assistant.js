import { useState } from "react";
import { askAssistant } from "../../services/aiService";
import { speak } from "../../utils/speech";

function Assistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async (event) => {
    event.preventDefault();
    const response = await askAssistant(question || "What is gravity?");
    setAnswer(response);
    speak(response);
  };

  return (
    <section className="page module-page">
      <span className="page-kicker">AI Assistant</span>
      <h1>Ask and hear the answer</h1>
      <form className="module-card wide" onSubmit={handleAsk}>
        <label>
          <span>Your question</span>
          <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Example: What is gravity?" />
        </label>
        <button type="submit">Ask Assistant</button>
        {answer && <p className="result-text">{answer}</p>}
      </form>
    </section>
  );
}

export default Assistant;

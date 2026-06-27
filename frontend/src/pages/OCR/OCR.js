import { useState } from "react";
import { readImageText } from "../../services/learningService";
import { speak } from "../../utils/speech";

function OCR() {
  const [text, setText] = useState("");

  const handleRead = async () => {
    const result = await readImageText({ demo: true });
    setText(result.text);
    speak(result.text);
  };

  return (
    <section className="page module-page">
      <span className="page-kicker">OCR Reader</span>
      <h1>Read image text aloud</h1>
      <article className="module-card wide">
        <p>Upload OCR integration can connect to Google Vision later. This demo endpoint returns readable text and speaks it.</p>
        <button onClick={handleRead}>Read Sample Image</button>
        {text && <p className="result-text">{text}</p>}
      </article>
    </section>
  );
}

export default OCR;

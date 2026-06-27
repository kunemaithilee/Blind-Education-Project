import { useState } from "react";
import { readImageText } from "../../services/learningService";
import { speak } from "../../utils/speech";

function OCR() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRead = async () => {
    setLoading(true);
    const result = await readImageText({ demo: true });
    setText(result.text);
    speak(result.text);
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!file) {
      speak("Please select an image file first.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${process.env.REACT_APP_API_URL || "/api"}/ocr/read`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const extracted = data.text || "No text could be extracted.";
      setText(extracted);
      speak(extracted);
    } catch {
      const msg = "Could not process the image. The OCR service may not be available.";
      setText(msg);
      speak(msg);
    }
    setLoading(false);
  };

  return (
    <section className="page module-page">
      <span className="page-kicker">OCR Reader</span>
      <h1>Read image text aloud</h1>
      <div className="module-grid">
        <article className="module-card wide">
          <h2>Upload an image</h2>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={loading || !file}>
            {loading ? "Processing..." : "Extract Text"}
          </button>
        </article>
        <article className="module-card wide">
          <h2>Or try a demo</h2>
          <p>Uses a sample response to demonstrate the voice output.</p>
          <button onClick={handleRead} disabled={loading}>Read Sample Image</button>
        </article>
      </div>
      {text && (
        <article className="module-card wide">
          <h2>Extracted Text</h2>
          <p className="result-text">{text}</p>
          <button onClick={() => speak(text)}>Read Aloud</button>
        </article>
      )}
    </section>
  );
}

export default OCR;

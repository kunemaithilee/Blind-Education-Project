import { useEffect, useState } from "react";
import { getAudioNotes } from "../../services/learningService";
import { speak } from "../../utils/speech";

function AudioNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    getAudioNotes().then(setNotes);
  }, []);

  return (
    <section className="page module-page">
      <span className="page-kicker">Audio Notes</span>
      <h1>Listen to saved notes</h1>
      <div className="module-grid">
        {notes.map((note) => (
          <article className="module-card" key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.text}</p>
            <span>{note.duration}</span>
            <button onClick={() => speak(note.text)}>Listen</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AudioNotes;

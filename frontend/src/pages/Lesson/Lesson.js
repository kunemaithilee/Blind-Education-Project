import { useEffect, useState } from "react";
import { getLessons } from "../../services/learningService";
import { speak, stopSpeaking } from "../../utils/speech";

function Lesson() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    getLessons().then(setLessons);
  }, []);

  const readAloud = (content) => {
    stopSpeaking();
    speak(content);
  };

  return (
    <section className="page module-page">
      <span className="page-kicker">Lesson Player</span>
      <h1>Audio lesson reader</h1>
      <div className="module-grid">
        {lessons.map((lesson) => (
          <article className="module-card" key={lesson._id || lesson.id}>
            <h2>{lesson.title}</h2>
            <p>{lesson.content}</p>
            <span className="lesson-meta">{lesson.course} • {lesson.duration}</span>
            <button onClick={() => readAloud(lesson.content)}>
              Read Aloud
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Lesson;

import { useEffect, useState } from "react";
import { getQuizzes } from "../../services/learningService";
import { speak } from "../../utils/speech";

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    getQuizzes().then(setQuizzes);
  }, []);

  return (
    <section className="page module-page">
      <span className="page-kicker">Quizzes</span>
      <h1>Sound-based practice</h1>
      <div className="module-grid">
        {quizzes.map((quiz) => (
          <article className="module-card" key={quiz.id}>
            <h2>{quiz.title}</h2>
            <p>{quiz.questions} spoken questions. Current accuracy {quiz.accuracy}%.</p>
            <span>{quiz.status}</span>
            <button onClick={() => speak(`Starting ${quiz.title}`)}>Start Quiz</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Quizzes;

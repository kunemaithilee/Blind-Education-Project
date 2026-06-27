import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizzes } from "../../services/quizService";
import { speak } from "../../utils/speech";

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getQuizzes().then(setQuizzes);
  }, []);

  const startQuiz = (quiz) => {
    speak(`Starting ${quiz.title}. First question: ${quiz.questions[0]?.question || "Get ready."}`);
    navigate(`/quiz/${quiz._id || quiz.id}`);
  };

  return (
    <section className="page module-page">
      <span className="page-kicker">Quizzes</span>
      <h1>Sound-based practice</h1>
      <div className="module-grid">
        {quizzes.map((quiz) => (
          <article className="module-card" key={quiz._id || quiz.id}>
            <h2>{quiz.title}</h2>
            <p>{quiz.questions?.length || 0} spoken questions.</p>
            <button onClick={() => startQuiz(quiz)}>Start Quiz</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Quizzes;

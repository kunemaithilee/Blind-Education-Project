import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById, submitQuiz } from "../../services/quizService";
import { speak, stopSpeaking } from "../../utils/speech";

function QuizTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuizById(id).then((data) => {
      if (data && data.questions) {
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(null));
      }
      setLoading(false);
    });
  }, [id]);

  const selectAnswer = (index) => {
    const next = [...answers];
    next[current] = index;
    setAnswers(next);
  };

  const next = () => {
    if (current < quiz.questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const finish = async () => {
    stopSpeaking();
    const res = await submitQuiz(id, answers);
    setResult(res);
    speak(`You scored ${res.score} out of ${res.total}. ${res.percentage} percent.`);
  };

  if (loading) {
    return (
      <section className="page module-page">
        <span className="page-kicker">Quiz</span>
        <h1>Loading quiz...</h1>
      </section>
    );
  }

  if (!quiz) {
    return (
      <section className="page module-page">
        <span className="page-kicker">Quiz</span>
        <h1>Quiz not found</h1>
        <button onClick={() => navigate("/quizzes")}>Back to quizzes</button>
      </section>
    );
  }

  if (result) {
    return (
      <section className="page module-page">
        <span className="page-kicker">Quiz Result</span>
        <h1>{quiz.title}</h1>
        <article className="module-card wide">
          <p className="result-text">
            You scored {result.score} out of {result.total} — {result.percentage}%
          </p>
          <div className="quiz-results">
            {result.results.map((r, i) => (
              <div key={i} className={`quiz-result-item ${r.isCorrect ? "correct" : "incorrect"}`}>
                <p><strong>Q{i + 1}:</strong> {r.question}</p>
                <p>Your answer: {r.selected}</p>
                {!r.isCorrect && <p>Correct answer: {r.correct}</p>}
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/quizzes")}>Back to quizzes</button>
        </article>
      </section>
    );
  }

  const q = quiz.questions[current];

  return (
    <section className="page module-page">
      <span className="page-kicker">Quiz • {quiz.title}</span>
      <h1>Question {current + 1} of {quiz.questions.length}</h1>
      <article className="module-card wide">
        <p className="quiz-question">{q.question}</p>
        <div className="quiz-options">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`quiz-option ${answers[current] === i ? "selected" : ""}`}
              onClick={() => {
                selectAnswer(i);
                speak(opt);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="quiz-nav">
          <button onClick={prev} disabled={current === 0}>Previous</button>
          <span className="quiz-progress">{current + 1} / {quiz.questions.length}</span>
          {current < quiz.questions.length - 1 ? (
            <button onClick={() => { next(); speak(quiz.questions[current + 1].question); }}>
              Next
            </button>
          ) : (
            <button onClick={finish} className="quiz-finish">Finish Quiz</button>
          )}
        </div>
      </article>
    </section>
  );
}

export default QuizTake;

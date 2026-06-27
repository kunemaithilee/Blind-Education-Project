import { useEffect, useState } from "react";
import { getProgress } from "../../services/learningService";

function Progress() {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    getProgress().then(setProgress);
  }, []);

  return (
    <section className="page module-page">
      <span className="page-kicker">Progress</span>
      <h1>Your learning progress</h1>
      {progress && (
        <>
          <div className="stats-grid module-stats">
            <article className="stat-card glass-card"><span>Completed Lessons</span><strong>{progress.completedLessons}/{progress.totalLessons}</strong></article>
            <article className="stat-card glass-card"><span>Learning Hours</span><strong>{progress.learningHours}</strong></article>
            <article className="stat-card glass-card"><span>Streak</span><strong>{progress.streakDays} days</strong></article>
            <article className="stat-card glass-card"><span>Quiz Accuracy</span><strong>{progress.quizAccuracy}%</strong></article>
          </div>
          <div className="module-grid">
            {progress.courses.map((course) => (
              <article className="module-card" key={course.title}>
                <h2>{course.title}</h2>
                <div className="course-progress"><i style={{ width: `${course.progress}%` }} /></div>
                <p>{course.progress}% complete</p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default Progress;

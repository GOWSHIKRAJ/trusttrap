import { Link, useParams } from 'react-router-dom';
import Quiz from '../components/Quiz.jsx';
import PasswordChecker from '../components/PasswordChecker.jsx';
import NotFound from './NotFound.jsx';
import { getLesson, LESSONS } from '../data/lessons.js';
import { updateProgress } from '../utils/progress.js';
import useProgress from '../utils/useProgress.js';

export default function LessonDetail() {
  const { lessonId } = useParams();
  const lesson = getLesson(lessonId);
  const progress = useProgress();

  if (!lesson) return <NotFound />;

  const index = LESSONS.findIndex((l) => l.id === lesson.id);
  const next = LESSONS[index + 1];
  const complete = !!progress.lessons[lesson.id];
  const score = progress.quizzes[lesson.id];

  const markComplete = (quizScore) => {
    updateProgress((p) => ({
      ...p,
      lessons: { ...p.lessons, [lesson.id]: true },
      quizzes: quizScore === undefined ? p.quizzes : { ...p.quizzes, [lesson.id]: quizScore },
      activities: quizScore === undefined ? p.activities : p.activities + 1,
    }));
  };

  return (
    <div className={`page-shell container lesson tone-${lesson.color}`}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/learn">← Learning centre</Link>
      </nav>

      <header className="lesson-hero">
        <p className="eyebrow">Lesson {String(index + 1).padStart(2, '0')}</p>
        <h1>{lesson.title}</h1>
        <p className="lead">{lesson.intro}</p>
        {complete && <p className="complete-pill">✓ Completed{score !== undefined ? ` · quiz ${score}%` : ''}</p>}
      </header>

      <section className="example" aria-labelledby="ex-title">
        <h2 id="ex-title" className="panel-title">Real-world example</h2>
        <div className="example-card">
          <p className="example-from">{lesson.example.from}</p>
          <p className="example-text">{lesson.example.text}</p>
          <p className="example-fine">Fictional example</p>
        </div>
      </section>

      <div className="lesson-cols">
        <section aria-labelledby="warn-title">
          <h2 id="warn-title" className="panel-title">Key warning signs</h2>
          <ul className="check-list warn">{lesson.warningSigns.map((w) => <li key={w}>{w}</li>)}</ul>
        </section>
        <section aria-labelledby="prev-title">
          <h2 id="prev-title" className="panel-title">Practical prevention</h2>
          <ul className="check-list safe">{lesson.prevention.map((p) => <li key={p}>{p}</li>)}</ul>
        </section>
      </div>

      {lesson.interactive === 'password' && (
        <section className="activity" aria-labelledby="act-title">
          <h2 id="act-title" className="panel-title">Password safety challenge</h2>
          <PasswordChecker onUse={() => updateProgress((p) => ({ ...p, activities: p.activities + 1 }))} />
        </section>
      )}

      <section className="activity" aria-labelledby="quiz-title">
        <h2 id="quiz-title" className="panel-title">Check your understanding</h2>
        <Quiz
          key={lesson.id}
          quiz={lesson.quiz}
          onAnswered={(s) => markComplete(s)}
        />
        {!complete && <p className="hint">Answering the question marks this lesson complete.</p>}
      </section>

      <footer className="lesson-foot">
        <Link to="/learn" className="btn btn-ghost">All lessons</Link>
        {next && <Link to={`/learn/${next.id}`} className="btn btn-primary">Next: {next.title} →</Link>}
      </footer>
    </div>
  );
}

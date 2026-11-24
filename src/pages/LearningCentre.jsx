import { Link } from 'react-router-dom';
import { LESSONS } from '../data/lessons.js';
import useProgress from '../utils/useProgress.js';

export default function LearningCentre() {
  const progress = useProgress();
  const done = Object.keys(progress.lessons).length;

  return (
    <div className="page-shell container">
      <header className="page-head learn-head">
        <div>
          <p className="eyebrow">Learn</p>
          <h1>Cyber Learning Centre</h1>
          <p className="lead">Short lessons, real examples and a quick check at the end of each one. Pick a topic that matters to you.</p>
        </div>
        <div className="learn-progress" aria-label={`${done} of ${LESSONS.length} lessons completed`}>
          <span className="learn-count">{done}<small>/{LESSONS.length}</small></span>
          <span>lessons completed</span>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${(done / LESSONS.length) * 100}%` }} /></div>
        </div>
      </header>

      <ul className="lesson-grid">
        {LESSONS.map((lesson, i) => {
          const complete = !!progress.lessons[lesson.id];
          return (
            <li key={lesson.id} className={`lesson-tile tone-${lesson.color} tile-${i % 4}`}>
              <Link to={`/learn/${lesson.id}`} className="lesson-link">
                <span className="lesson-no">{String(i + 1).padStart(2, '0')}</span>
                <h2>{lesson.title}</h2>
                <p>{lesson.summary}</p>
                <span className="lesson-state">{complete ? '✓ Completed' : 'Start lesson →'}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal.jsx';
import Toast from '../components/Toast.jsx';
import { LESSONS } from '../data/lessons.js';
import { BADGES, resetProgress } from '../utils/progress.js';
import useProgress from '../utils/useProgress.js';

export default function MyJourney() {
  const progress = useProgress();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState('');
  const clearToast = useCallback(() => setToast(''), []);

  const lessonsDone = Object.keys(progress.lessons).length;
  const quizScores = Object.values(progress.quizzes);
  const avgQuiz = quizScores.length ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : null;
  const unlocked = BADGES.filter((b) => b.unlocked(progress));
  const isEmpty = lessonsDone === 0 && progress.simulations === 0 && progress.analyses === 0 && progress.activities === 0 && progress.safeDecisions === 0 && progress.unsafeDecisions === 0;

  const doReset = () => {
    resetProgress();
    setConfirmOpen(false);
    setToast('Progress reset. Your journey starts fresh.');
  };

  return (
    <div className="page-shell container">
      <header className="page-head journey-head">
        <div>
          <p className="eyebrow">My Journey</p>
          <h1>Your safety journey</h1>
          <p className="lead">Progress is saved only in this browser. No account, no tracking and no global statistics.</p>
        </div>
        {!isEmpty && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmOpen(true)}>Reset progress</button>
        )}
      </header>

      {isEmpty ? (
        <section className="empty-state" aria-labelledby="empty-title">
          <span className="empty-mark" aria-hidden="true">?</span>
          <h2 id="empty-title">Your journey has not started yet</h2>
          <p>Try the message simulation, analyse a suspicious text or finish a lesson. Your progress will appear here.</p>
          <div className="cta-row">
            <Link to="/message" className="btn btn-primary">Start the simulation</Link>
            <Link to="/learn" className="btn btn-ghost">Open a lesson</Link>
          </div>
        </section>
      ) : (
        <>
          <section className="stat-grid" aria-label="Your statistics">
            <div className="stat stat-coral"><span>{progress.simulations}</span><p>Simulations completed</p></div>
            <div className="stat stat-sage"><span>{progress.safeDecisions}</span><p>Safe decisions</p></div>
            <div className="stat stat-cobalt"><span>{progress.analyses}</span><p>Messages analysed</p></div>
            <div className="stat stat-sun"><span>{progress.activities}</span><p>Activities completed</p></div>
            <div className="stat stat-blush"><span>{avgQuiz === null ? '—' : `${avgQuiz}%`}</span><p>Average quiz score</p></div>
          </section>

          <section className="progress-block" aria-labelledby="lp-title">
            <h2 id="lp-title" className="panel-title">Learning progress</h2>
            <p>{lessonsDone} of {LESSONS.length} lessons completed</p>
            <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={LESSONS.length} aria-valuenow={lessonsDone}>
              <div className="progress-fill" style={{ width: `${(lessonsDone / LESSONS.length) * 100}%` }} />
            </div>
            <ul className="lesson-status">
              {LESSONS.map((l) => (
                <li key={l.id} className={progress.lessons[l.id] ? 'done' : ''}>
                  <Link to={`/learn/${l.id}`}>{l.title}</Link>
                  <span>{progress.lessons[l.id] ? (progress.quizzes[l.id] !== undefined ? `${progress.quizzes[l.id]}%` : '✓') : 'Not started'}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <section className="badges" aria-labelledby="badge-title">
        <div className="badge-head">
          <h2 id="badge-title" className="panel-title">Achievement badges</h2>
          <p>{unlocked.length} of {BADGES.length} unlocked</p>
        </div>
        <ul className="badge-grid">
          {BADGES.map((b, i) => {
            const isUnlocked = b.unlocked(progress);
            return (
              <li key={b.id} className={`badge ${isUnlocked ? 'unlocked' : 'locked'} badge-${i % 3}`}>
                <span className="badge-seal" aria-hidden="true">{isUnlocked ? '★' : '○'}</span>
                <h3>{b.name}</h3>
                <p>{b.description}</p>
                <span className="badge-state">{isUnlocked ? 'Unlocked' : 'Locked'}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Reset all progress?" id="reset">
        <p className="modal-text">This removes your lessons, quiz scores, simulation history and badges from this browser. This cannot be undone.</p>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={doReset}>Yes, reset progress</button>
          <button type="button" className="btn btn-ghost" onClick={() => setConfirmOpen(false)}>Cancel</button>
        </div>
      </Modal>

      <Toast message={toast} onDone={clearToast} />
    </div>
  );
}

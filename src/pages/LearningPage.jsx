import { useMemo, useState } from 'react';
import { LESSONS } from '../data/lessons';
import { useProgress } from '../context/ProgressContext';
import LessonView from '../components/learning/LessonView';
import '../styles/learning.css';

export default function LearningPage() {
  const { progress } = useProgress();
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LESSONS;
    return LESSONS.filter((lesson) => `${lesson.title} ${lesson.summary}`.toLowerCase().includes(q));
  }, [query]);

  const openLesson = LESSONS.find((lesson) => lesson.id === openId) ?? null;

  return (
    <section aria-labelledby="learn-title">
      <header className="page-header">
        <p className="eyebrow">Module 05 · Learning Hub</p>
        <h1 id="learn-title">Short lessons. Real habits.</h1>
        <p className="lede">
          Each lesson has three short cards, a practical tip on each, and a two-question knowledge check. Pass the
          check to earn 20 XP.
        </p>
      </header>

      <div className="learn-grid">
        <div className="learn-list">
          <label htmlFor="lesson-search" className="learn-search__label">
            Search lessons
          </label>
          <input
            id="lesson-search"
            type="search"
            className="learn-search"
            placeholder="Try phishing, UPI or OTP"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <p className="muted-note">
            {progress.lessons.length} of {LESSONS.length} lessons completed
          </p>

          {filtered.length === 0 ? (
            <p className="empty-note">No lessons match “{query}”. Try a shorter word.</p>
          ) : (
            <ol className="lesson-rows">
              {filtered.map((lesson) => {
                const done = progress.lessons.includes(lesson.id);
                const active = lesson.id === openId;
                return (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      className={`lesson-row${active ? ' is-active' : ''}${done ? ' is-done' : ''}`}
                      aria-pressed={active}
                      onClick={() => setOpenId(lesson.id)}
                    >
                      <span className="lesson-row__num">{String(LESSONS.indexOf(lesson) + 1).padStart(2, '0')}</span>
                      <span className="lesson-row__text">
                        <span className="lesson-row__title">{lesson.title}</span>
                        <span className="lesson-row__summary">{lesson.summary}</span>
                      </span>
                      <span className="lesson-row__state">{done ? 'Done' : 'Open'}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="learn-view">
          {openLesson ? (
            <LessonView key={openLesson.id} lesson={openLesson} />
          ) : (
            <div className="panel learn-empty">
              <p className="eyebrow">Choose a lesson</p>
              <p>
                Pick a topic from the list to begin. Lessons are short, and you can return to any card at any time.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

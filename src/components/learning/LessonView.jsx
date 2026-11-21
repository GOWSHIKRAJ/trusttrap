import { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';

export default function LessonView({ lesson }) {
  const { progress, completeLesson } = useProgress();
  const alreadyDone = progress.lessons.includes(lesson.id);

  const [step, setStep] = useState(0); // 0 to cards.length - 1 are cards; cards.length is the check
  const [showTip, setShowTip] = useState(false);
  const [picks, setPicks] = useState(() => lesson.checks.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [earned, setEarned] = useState(false);

  const cardCount = lesson.cards.length;
  const onCheck = step === cardCount;

  function goTo(next) {
    setStep(next);
    setShowTip(false);
  }

  function pick(questionIndex, optionIndex) {
    setPicks((current) => current.map((value, i) => (i === questionIndex ? optionIndex : value)));
  }

  function submit() {
    setSubmitted(true);
    const score = lesson.checks.reduce((n, check, i) => n + (picks[i] === check.answer ? 1 : 0), 0);
    if (score === lesson.checks.length) {
      setEarned(completeLesson(lesson));
    }
  }

  function retry() {
    setPicks(lesson.checks.map(() => null));
    setSubmitted(false);
    setEarned(false);
    goTo(0);
  }

  if (!onCheck) {
    const card = lesson.cards[step];
    return (
      <article className="panel lesson">
        <header className="lesson__head">
          <p className="eyebrow">{lesson.title}</p>
          <span className="lesson__progress">
            Card {step + 1} of {cardCount}
          </span>
        </header>

        <h2 className="lesson__card-title">{card.heading}</h2>
        <p className="lesson__body">{card.body}</p>

        <div className="lesson__tip">
          {showTip ? (
            <p>
              <span className="lesson__tip-label">Practical tip</span> {card.tip}
            </p>
          ) : (
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setShowTip(true)}>
              Show the practical tip
            </button>
          )}
        </div>

        <div className="lesson__nav">
          <button type="button" className="btn btn--ghost" disabled={step === 0} onClick={() => goTo(step - 1)}>
            Back
          </button>
          <button type="button" className="btn btn--primary" onClick={() => goTo(step + 1)}>
            {step + 1 < cardCount ? 'Next card' : 'Start the knowledge check'}
          </button>
        </div>
      </article>
    );
  }

  const score = lesson.checks.reduce((n, check, i) => n + (picks[i] === check.answer ? 1 : 0), 0);
  const allAnswered = picks.every((value) => value !== null);

  return (
    <article className="panel lesson">
      <header className="lesson__head">
        <p className="eyebrow">{lesson.title}</p>
        <span className="lesson__progress">Knowledge check</span>
      </header>

      {lesson.checks.map((check, qi) => (
        <fieldset key={check.question} className="check">
          <legend className="check__question">
            {qi + 1}. {check.question}
          </legend>
          {check.options.map((option, oi) => {
            const picked = picks[qi] === oi;
            const isCorrect = submitted && oi === check.answer;
            const isWrong = submitted && picked && oi !== check.answer;
            const classes = ['check__option'];
            if (isCorrect) classes.push('is-correct');
            if (isWrong) classes.push('is-wrong');
            return (
              <label key={option} className={classes.join(' ')}>
                <input
                  type="radio"
                  name={`${lesson.id}-q${qi}`}
                  checked={picked}
                  disabled={submitted}
                  onChange={() => pick(qi, oi)}
                />
                <span>{option}</span>
              </label>
            );
          })}
          {submitted && <p className="check__explain">{check.explanation}</p>}
        </fieldset>
      ))}

      {!submitted ? (
        <div className="lesson__nav">
          <button type="button" className="btn btn--ghost" onClick={() => goTo(cardCount - 1)}>
            Review the cards
          </button>
          <button type="button" className="btn btn--primary" disabled={!allAnswered} onClick={submit}>
            Submit answers
          </button>
        </div>
      ) : (
        <div className="check__result" role="status">
          {score === lesson.checks.length ? (
            <p>
              All correct.{' '}
              {earned
                ? 'Lesson complete. +20 XP added to your profile.'
                : alreadyDone
                  ? 'This lesson is already on your record.'
                  : ''}
            </p>
          ) : (
            <p>
              {score} of {lesson.checks.length} correct. Review the cards, then try again.
            </p>
          )}
          <div className="lesson__nav">
            <button type="button" className="btn btn--ghost" onClick={() => goTo(0)}>
              Read the cards again
            </button>
            {score !== lesson.checks.length && (
              <button type="button" className="btn btn--primary" onClick={retry}>
                Try the check again
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

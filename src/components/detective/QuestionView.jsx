import { useEffect, useState } from 'react';
import MessageThread from './MessageThread';
import FeedbackPanel from './FeedbackPanel';

const LETTERS = 'ABCD';

export default function QuestionView({ question, index, total, config, answer, tally, onAnswer, onNext }) {
  const { scenario, choices } = question;
  const answered = Boolean(answer);
  const timed = Boolean(config.timerSeconds);
  const [timeLeft, setTimeLeft] = useState(config.timerSeconds ?? 0);
  const [showHint, setShowHint] = useState(false);

  // Countdown for timed rounds. When it reaches zero the scenario is answered with no choice.
  useEffect(() => {
    if (!timed || answered) return undefined;
    if (timeLeft <= 0) {
      onAnswer(null);
      return undefined;
    }
    const id = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearTimeout(id);
  }, [timed, answered, timeLeft, onAnswer]);

  const chosen = answer?.choiceId ? choices.find((c) => c.id === answer.choiceId) : null;
  const correctChoice = choices.find((c) => c.correct) ?? null;
  const isLast = index + 1 === total;
  const timerPercent = timed ? Math.max(0, (timeLeft / config.timerSeconds) * 100) : 0;

  return (
    <div className="round">
      <div className="round__status">
        <span>
          Scenario {index + 1} of {total}
        </span>
        <span className="round__tally">
          Correct {tally.correct} · Incorrect {tally.incorrect}
        </span>
      </div>
      <div className="round__progress" aria-hidden="true">
        <span style={{ width: `${(index / total) * 100}%` }} />
      </div>

      <div className="round__grid">
        <div className="round__scene">
          <MessageThread scenario={scenario} />

          {config.hintsAllowed && !answered && (
            <div className="hint-row">
              {showHint ? (
                <p className="hint">Hint: {scenario.hint}</p>
              ) : (
                <button type="button" className="btn btn--ghost btn--small" onClick={() => setShowHint(true)}>
                  Show a hint
                </button>
              )}
            </div>
          )}
        </div>

        <div className="panel round__decision">
          <div className="round__head">
            <h2>{scenario.title}</h2>
            {timed && (
              <div className={`timer${timeLeft <= 5 && !answered ? ' is-urgent' : ''}`} aria-live="off">
                <span className="timer__value">{answered ? 'Locked' : `${timeLeft}s`}</span>
                <div className="timer__bar" aria-hidden="true">
                  <span style={{ width: `${answered ? 0 : timerPercent}%` }} />
                </div>
              </div>
            )}
          </div>

          <p className="round__prompt">What do you do?</p>

          <ul className="choices">
            {choices.map((choice, i) => {
              const isChosen = answer?.choiceId === choice.id;
              const classes = ['choice'];
              if (isChosen) classes.push('is-chosen');
              if (answered && choice.correct) classes.push('is-correct');
              if (answered && isChosen && !choice.correct) classes.push('is-wrong');

              return (
                <li key={choice.id}>
                  <button
                    type="button"
                    className={classes.join(' ')}
                    disabled={answered}
                    onClick={() => onAnswer(choice.id)}
                  >
                    <span className="choice__letter">{LETTERS[i]}</span>
                    <span>{choice.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {answered && (
            <FeedbackPanel
              answer={answer}
              chosen={chosen}
              correctChoice={correctChoice}
              scenario={scenario}
              isLast={isLast}
              onNext={onNext}
            />
          )}
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { summarize } from '../../utils/detective';

function headlineFor(accuracy) {
  if (accuracy === 100) return 'Flawless read.';
  if (accuracy >= 67) return 'Strong instincts.';
  if (accuracy >= 34) return 'Good start. Review the flags you missed.';
  return 'Keep practising. Every scam here follows a pattern.';
}

function SummaryTile({ label, value }) {
  return (
    <div className="stat-tile">
      <span className="stat-tile__label">{label}</span>
      <span className="stat-tile__value">{value}</span>
    </div>
  );
}

export default function RoundSummary({ questions, answers, config, record, onReplay, onChangeDifficulty }) {
  const stats = summarize(answers);

  return (
    <section className="summary" aria-labelledby="summary-title">
      <header className="summary__head">
        <p className="eyebrow">{config.label} round complete</p>
        <h2 id="summary-title">{headlineFor(stats.accuracy)}</h2>
      </header>

      <div className="stat-tiles summary__tiles">
        <SummaryTile label="Correct" value={`${stats.correct} / ${stats.total}`} />
        <SummaryTile label="Accuracy" value={`${stats.accuracy}%`} />
        <SummaryTile label="XP earned" value={`+${stats.xp}`} />
        <SummaryTile label="Best record" value={record ? `${record.correct} / ${record.total}` : '—'} />
      </div>

      <ol className="review">
        {questions.map((question, i) => {
          const answer = answers[i];
          const bestMove = question.choices.find((c) => c.correct);
          const outcome = answer.correct ? 'Correct' : answer.timedOut ? 'Time ran out' : 'Incorrect';
          return (
            <li key={question.id} className={`review__item ${answer.correct ? 'is-correct' : 'is-wrong'}`}>
              <span className="review__index">{String(i + 1).padStart(2, '0')}</span>
              <div className="review__body">
                <p className="review__title">{question.scenario.title}</p>
                <p className="review__outcome">{outcome}</p>
                {!answer.correct && <p className="review__best">Best move: {bestMove.text}</p>}
              </div>
              <span className="review__xp">{answer.xp > 0 ? `+${answer.xp} XP` : ''}</span>
            </li>
          );
        })}
      </ol>

      <div className="summary__actions">
        <button type="button" className="btn btn--primary" onClick={onReplay}>
          Play this round again
        </button>
        <button type="button" className="btn btn--ghost" onClick={onChangeDifficulty}>
          Choose a difficulty
        </button>
        <Link to="/scanner" className="btn btn--ghost summary__link">
          Test a real message in the Scanner
        </Link>
      </div>
    </section>
  );
}

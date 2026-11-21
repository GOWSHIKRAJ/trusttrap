import { DIFFICULTIES, DIFFICULTY_ORDER } from '../../utils/detective';

export default function DifficultyPicker({ best, onStart }) {
  return (
    <div className="picker">
      <div className="panel picker__intro">
        <p>
          Each scenario arrives as a real-looking message. Read it the way you would read it on your own phone, then
          choose the response a careful person would make. Every answer is explained, right or wrong.
        </p>
      </div>

      <div className="difficulty-list">
        {DIFFICULTY_ORDER.map((key) => {
          const config = DIFFICULTIES[key];
          const record = best[key];
          return (
            <article key={key} className="panel difficulty">
              <h3>{config.label}</h3>
              <p className="muted-note">{config.detail}</p>
              <p className="difficulty__best">
                {record ? `Best: ${record.correct} of ${record.total} correct` : 'No round played yet'}
              </p>
              <button type="button" className="btn btn--primary difficulty__start" onClick={() => onStart(key)}>
                Start {config.label.toLowerCase()} round
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

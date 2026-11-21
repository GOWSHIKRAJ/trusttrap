export default function FlagDocument({ stage, state, onToggle, onSubmit }) {
  const locked = state.phase !== 'stage';

  return (
    <div className="offer">
      <div className="offer__meta">
        <span>From: {stage.offer.from}</span>
        <span>Subject: {stage.offer.subject}</span>
      </div>

      <ul className="offer__lines">
        {stage.lines.map((line) => {
          const flagged = state.flagged.includes(line.id);
          return (
            <li key={line.id}>
              <button
                type="button"
                className={`clue-line${flagged ? ' is-flagged' : ''}`}
                aria-pressed={flagged}
                disabled={locked}
                onClick={() => onToggle(line.id)}
              >
                <span className="clue-line__mark" aria-hidden="true">
                  {flagged ? '!' : '·'}
                </span>
                <span>{line.text}</span>
              </button>
              {locked && (
                <p className={`clue-line__reason${line.red ? ' is-red' : ''}`}>
                  {line.red ? 'Red flag. ' : 'Safe. '}
                  {line.reason}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {!locked && (
        <div className="offer__actions">
          <p className="help">Click each line that looks suspicious to flag it. Leave ordinary details unflagged.</p>
          <button type="button" className="btn btn--primary" onClick={onSubmit}>
            Submit findings
          </button>
        </div>
      )}
    </div>
  );
}

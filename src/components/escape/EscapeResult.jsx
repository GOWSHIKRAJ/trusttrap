import { STAGE_XP, STAGES } from '../../data/escapeContent';
import { formatTime } from '../../utils/escape';

function ResultTile({ label, value }) {
  return (
    <div className="stat-tile">
      <span className="stat-tile__label">{label}</span>
      <span className="stat-tile__value">{value}</span>
    </div>
  );
}

export default function EscapeResult({ state, onReplay }) {
  const escaped = state.phase === 'escaped';
  const cleanLocks = state.results.filter((r) => r.correct).length;
  const xpEarned = cleanLocks * STAGE_XP + (escaped ? state.escapeXp : 0);
  const failedStage = STAGES[state.stageIndex];

  return (
    <section className={`escape-result ${escaped ? 'is-escaped' : 'is-trapped'}`} aria-labelledby="result-title">
      <p className="eyebrow">{escaped ? 'Escape complete' : 'Trapped'}</p>
      <h2 id="result-title" className="escape-result__title">
        {escaped ? 'You got out.' : 'The clock ran out.'}
      </h2>
      <p className="escape-result__text">
        {escaped
          ? 'All three locks are open and the scam is shut out. The scammer never got your money or your details.'
          : `Time ran out at Lock ${failedStage.number}: ${failedStage.title}. Remember this: ${failedStage.lesson}`}
      </p>

      <div className="stat-tiles escape-result__tiles">
        <ResultTile label="Clean locks" value={`${cleanLocks} / ${STAGES.length}`} />
        <ResultTile label="Time left" value={formatTime(state.timeLeft)} />
        <ResultTile label="Mistakes" value={state.totalMistakes} />
        <ResultTile label="XP earned" value={`+${xpEarned}`} />
      </div>

      <button type="button" className="btn btn--primary" onClick={onReplay}>
        Run the escape again
      </button>
    </section>
  );
}

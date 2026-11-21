import ScoreRing from './ScoreRing';
import FlagList from './FlagList';

export default function ScanReport({ analysis }) {
  if (analysis.status !== 'ok') {
    return <p className="muted-note">Add a little more context and try again.</p>;
  }

  const { score, rawScore, level, flags, steps, hasIndicators } = analysis;
  const flagWord = flags.length === 1 ? 'indicator' : 'indicators';

  return (
    <article className={`report tone-${level.tone}`} aria-label="Investigation report">
      <div className="report__summary">
        <ScoreRing score={score} />
        <div>
          <p className="eyebrow">Verdict</p>
          <h2 className="verdict">{level.label}</h2>
          <p>{level.headline}</p>
          <p className="report__math">
            {flags.length} {flagWord} · {rawScore} raw points
            {rawScore > 100 ? ', capped at 100' : ''}
          </p>
        </div>
      </div>

      {hasIndicators ? (
        <FlagList flags={flags} />
      ) : (
        <div className="notice">
          No known scam indicators matched. This does not confirm the message is genuine. The scanner only
          checks for known patterns, so verify through official channels before acting on anything.
        </div>
      )}

      <section aria-labelledby="steps-heading">
        <h3 id="steps-heading">Recommended next steps</h3>
        <ol className="steps">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <p className="disclaimer">
        TRUSTTRAP's scanner is an educational, rule-based tool. It is not a certified security product and cannot
        guarantee whether a message is genuine.
      </p>
    </article>
  );
}

import { SAMPLE_MESSAGES } from '../../data/sampleMessages';
import { analyzeMessage } from '../../utils/scamEngine';

const sample = SAMPLE_MESSAGES.find((s) => s.id === 'bank-kyc');
const analysis = analyzeMessage(sample.text);

/** Shows how one real sample's score is built from its matched rules. Computed live by the engine. */
export default function ExampleBreakdown() {
  const capped = analysis.rawScore > 100;

  return (
    <figure className="breakdown">
      <figcaption className="breakdown__caption">
        <span className="breakdown__tag">Live example</span>
        <span>
          How the engine scores “{sample.label}”. Each segment is one matched rule, sized by its weight.
        </span>
      </figcaption>

      <div className="breakdown__bar" role="img" aria-label={`Score built from ${analysis.flags.length} rules`}>
        {analysis.flags.map((flag, index) => (
          <span
            key={flag.id}
            className="breakdown__segment"
            style={{ flexGrow: flag.weight, '--i': index }}
            title={`${flag.title}: +${flag.weight}`}
          />
        ))}
      </div>

      <ul className="breakdown__legend">
        {analysis.flags.map((flag) => (
          <li key={flag.id}>
            <span>{flag.title}</span>
            <span>+{flag.weight}</span>
          </li>
        ))}
      </ul>

      <p className="breakdown__note">
        Raw total {analysis.rawScore}
        {capped ? `, capped at ${analysis.score}` : ''}. Final verdict: {analysis.level.label}.
      </p>
    </figure>
  );
}

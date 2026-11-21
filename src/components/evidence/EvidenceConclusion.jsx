import { CATEGORIES } from '../../data/evidenceCase';

export default function EvidenceConclusion({ done, examined, total, analysis }) {
  if (!done) {
    return (
      <section className="panel conclusion is-locked" aria-labelledby="conclusion-title">
        <p className="panel__title" id="conclusion-title">Conclusion</p>
        <p className="muted-note">
          Examine all {total} categories to unlock the conclusion. {total - examined} still to go.
        </p>
      </section>
    );
  }

  return (
    <section className="panel conclusion" aria-labelledby="conclusion-title">
      <p className="panel__title" id="conclusion-title">Conclusion</p>
      <h3 className="conclusion__headline">Every category points the same way.</h3>
      <p className="conclusion__text">
        Combined, these findings match a fake official notice: a sender that cannot be verified, an invented deadline,
        a lookalike link, a fee, and a request for identity details. The safe response is to ignore the message and
        check any real notice through the official portal.
      </p>

      <h4 className="conclusion__sub">Combined red flags</h4>
      <ul className="flag-check">
        {CATEGORIES.map((category) => (
          <li key={category.id}>
            <span className="conclusion__cat">{category.label}:</span> {category.summary}
          </li>
        ))}
      </ul>

      <p className="conclusion__scanner">
        The TRUSTTRAP Scanner rates this message <strong>{analysis.level.label}</strong>, score {analysis.score}, from{' '}
        {analysis.flags.length} matched rules: {analysis.flags.map((flag) => flag.title).join('; ')}.
      </p>
      <p className="disclaimer">
        The scanner is a rule-based educational tool. It shows the pattern, but only an official channel can confirm a
        notice.
      </p>
    </section>
  );
}

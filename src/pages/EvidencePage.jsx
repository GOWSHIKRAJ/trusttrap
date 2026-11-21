import { useProgress } from '../context/ProgressContext';
import { CASE, CATEGORIES } from '../data/evidenceCase';
import { analyzeMessage } from '../utils/scamEngine';
import { categoryRef } from '../utils/evidence';
import EvidenceCategory from '../components/evidence/EvidenceCategory';
import EvidenceConclusion from '../components/evidence/EvidenceConclusion';
import '../styles/evidence.css';

// The engine's verdict on the case message. Pure and computed once.
const analysis = analyzeMessage(CASE.message);

export default function EvidencePage() {
  const { progress, revealEvidence } = useProgress();
  const examined = progress.evidenceCategories.length;
  const total = CATEGORIES.length;
  const done = examined === total;
  const percent = Math.round((examined / total) * 100);

  function examine(item, category) {
    revealEvidence(item.id, categoryRef(category));
  }

  return (
    <section aria-labelledby="evidence-title">
      <header className="page-header">
        <p className="eyebrow">Module 04 · Evidence Room</p>
        <h1 id="evidence-title">Open the case file.</h1>
        <p className="lede">
          Examine each category of this fictional message. Every item reveals what it shows and why it matters.
        </p>
      </header>

      <div className="evidence-grid">
        <aside className="panel case-file" aria-label="Case file">
          <p className="eyebrow">Case file</p>
          <h2 className="case-file__title">{CASE.title}</h2>
          <dl className="case-meta">
            <div>
              <dt>Sender</dt>
              <dd>{CASE.sender}</dd>
            </div>
            <div>
              <dt>Channel</dt>
              <dd>{CASE.channel}</dd>
            </div>
            <div>
              <dt>Received</dt>
              <dd>{CASE.received}</dd>
            </div>
          </dl>
          <p className="case-file__message">{CASE.message}</p>

          <div className="case-progress">
            <span>
              {examined} of {total} categories examined
            </span>
            <div className="xp-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Categories examined">
              <span style={{ width: `${percent}%` }} />
            </div>
          </div>
        </aside>

        <div className="evidence-list">
          {CATEGORIES.map((category, index) => (
            <EvidenceCategory
              key={category.id}
              index={index}
              category={category}
              progress={progress}
              onExamine={examine}
            />
          ))}
          <EvidenceConclusion done={done} examined={examined} total={total} analysis={analysis} />
        </div>
      </div>
    </section>
  );
}

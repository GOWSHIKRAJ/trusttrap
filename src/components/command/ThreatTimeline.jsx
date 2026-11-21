import useLocalStorage from '../../hooks/useLocalStorage';

const MAX_BARS = 12;

/** Bars show the scores of this device's recent scans, oldest on the left. Written by the Scanner page. */
export default function ThreatTimeline() {
  const [history] = useLocalStorage('trusttrap.scanHistory', []);
  const recent = [...history].slice(0, MAX_BARS).reverse();

  return (
    <div>
      <div className="timeline__head">
        <p className="panel__title">Threat timeline</p>
        {history.length > 0 && <span className="muted-note">{history.length} stored</span>}
      </div>

      {recent.length === 0 ? (
        <p className="empty-note">Scan a message to start your threat timeline.</p>
      ) : (
        <div className="timeline" role="img" aria-label={`Scores of your last ${recent.length} scans`}>
          {recent.map((entry) => (
            <div
              key={entry.id}
              className={`timeline__col tone-${entry.tone}`}
              title={`${entry.level}, score ${entry.score}`}
            >
              <span className="timeline__bar" style={{ height: `${Math.max(6, entry.score)}%` }} />
            </div>
          ))}
        </div>
      )}

      <p className="muted-note">Each bar is one scan's score on a 0 to 100 scale. Kept on this device only.</p>
    </div>
  );
}

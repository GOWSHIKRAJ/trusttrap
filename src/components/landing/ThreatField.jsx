import { useState } from 'react';
import { SAMPLE_MESSAGES } from '../../data/sampleMessages';
import { analyzeMessage } from '../../utils/scamEngine';

const TONE_COLOR = {
  safe: 'var(--safe)',
  warn: 'var(--warn)',
  danger: 'var(--danger)',
  critical: 'var(--critical)',
};

// Node positions in percent of the field, arranged around the central hub.
const NODE_POSITIONS = [
  { x: 50, y: 14 },
  { x: 84, y: 32 },
  { x: 84, y: 70 },
  { x: 50, y: 88 },
  { x: 16, y: 70 },
  { x: 16, y: 32 },
];

// Decorative background points. Purely visual, they carry no data.
const AMBIENT = [
  { x: 30, y: 24 }, { x: 68, y: 18 }, { x: 92, y: 50 }, { x: 70, y: 60 }, { x: 34, y: 62 },
  { x: 8, y: 52 }, { x: 40, y: 92 }, { x: 62, y: 42 }, { x: 22, y: 12 }, { x: 78, y: 10 },
];

// Each node is a real sample message, scored by the real engine.
const SIGNALS = SAMPLE_MESSAGES.slice(0, NODE_POSITIONS.length).map((sample, index) => {
  const analysis = analyzeMessage(sample.text);
  const topFlag = [...analysis.flags].sort((a, b) => b.weight - a.weight)[0] ?? null;
  return { sample, analysis, topFlag, position: NODE_POSITIONS[index] };
});

export default function ThreatField() {
  const [activeId, setActiveId] = useState(null);
  const active = SIGNALS.find((signal) => signal.sample.id === activeId) ?? null;

  function toggle(id) {
    setActiveId((current) => (current === id ? null : id));
  }

  return (
    <>
      <div className="threat-field">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle className="threat-field__ring" cx="50" cy="50" r="46" />
          <circle className="threat-field__ring threat-field__ring--dashed" cx="50" cy="50" r="31" />
          {AMBIENT.map((point, index) => (
            <circle key={index} className="threat-field__ambient" cx={point.x} cy={point.y} r="0.6" />
          ))}
          {SIGNALS.map(({ sample, position }) => (
            <line
              key={sample.id}
              className={`threat-field__link${active?.sample.id === sample.id ? ' is-active' : ''}`}
              x1="50"
              y1="50"
              x2={position.x}
              y2={position.y}
            />
          ))}
        </svg>

        <div className="threat-field__hub" aria-hidden="true">
          YOU
        </div>

        {SIGNALS.map(({ sample, position, analysis }, index) => {
          const isActive = active?.sample.id === sample.id;
          return (
            <button
              key={sample.id}
              type="button"
              className={`threat-field__node${isActive ? ' is-active' : ''}`}
              style={{
                '--x': `${position.x}%`,
                '--y': `${position.y}%`,
                '--tone': TONE_COLOR[analysis.level.tone],
                '--delay': `${index * 0.4}s`,
              }}
              aria-pressed={isActive}
              aria-label={`${sample.label}, ${sample.channel}. ${analysis.level.label}`}
              onClick={() => toggle(sample.id)}
            >
              <span className="threat-field__dot" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <div
        className="readout"
        aria-live="polite"
        style={active ? { '--tone': TONE_COLOR[active.analysis.level.tone] } : undefined}
      >
        {active ? (
          <>
            <p className="readout__label">Signal · {active.sample.channel}</p>
            <p className="readout__title">{active.sample.label}</p>
            <p className="readout__meta">
              {active.analysis.level.label} · score {active.analysis.score} ·{' '}
              {active.analysis.flags.length} {active.analysis.flags.length === 1 ? 'indicator' : 'indicators'}
            </p>
            {active.topFlag && <p className="readout__top">Strongest signal: {active.topFlag.title}</p>}
          </>
        ) : (
          <p className="readout__hint">
            Select a node to inspect a real sample from the Scanner. The engine scores it on the spot.
          </p>
        )}
      </div>
    </>
  );
}

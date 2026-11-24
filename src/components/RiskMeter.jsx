import { useEffect, useState } from 'react';

/** Animated horizontal risk meter. The bar grows from zero when the score changes. */
export default function RiskMeter({ score, level }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  return (
    <div className="risk-meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} aria-label="Risk score">
      <div className="risk-meter-track">
        <div className={`risk-meter-fill level-${level}`} style={{ width: `${width}%` }} />
      </div>
      <div className="risk-meter-scale" aria-hidden="true">
        <span>Low</span><span>Medium</span><span>High</span><span>Critical</span>
      </div>
    </div>
  );
}

export default function GuardianLevel({ level, xp }) {
  const percent = Math.round(level.fraction * 100);

  return (
    <div className="level">
      <p className="panel__title">Cyber Guardian level</p>
      <div className="level__head">
        <span className="level__number" aria-hidden="true">
          {String(level.number).padStart(2, '0')}
        </span>
        <div>
          <h2 className="level__name">{level.name}</h2>
          <p className="muted-note">{xp} XP total</p>
        </div>
      </div>
      <div
        className="xp-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Progress to the next level"
      >
        <span style={{ width: `${percent}%` }} />
      </div>
      <p className="muted-note">
        {level.next ? `${level.xpToNext} XP to ${level.next.name}` : 'Highest level reached'}
      </p>
    </div>
  );
}

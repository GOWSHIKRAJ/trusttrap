import { ACHIEVEMENTS } from '../../data/achievements';

export default function AchievementGrid({ progress }) {
  return (
    <ul className="badges">
      {ACHIEVEMENTS.map((badge) => {
        const unlocked = progress.achievementsUnlocked.includes(badge.id);
        return (
          <li key={badge.id} className={`badge-tile${unlocked ? ' is-unlocked' : ''}`}>
            <span className="badge-tile__mark" aria-hidden="true">
              {unlocked ? '◆' : '◇'}
            </span>
            <div>
              <h4>{badge.title}</h4>
              <p>{badge.detail}</p>
              <span className="badge-tile__state">{unlocked ? 'Unlocked' : 'Locked'}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

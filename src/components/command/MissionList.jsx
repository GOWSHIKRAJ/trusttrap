import { MISSIONS } from '../../data/missions';
import { metricValue } from '../../utils/progress';

export default function MissionList({ progress }) {
  return (
    <ul className="missions">
      {MISSIONS.map((mission) => {
        const done = progress.missionsDone.includes(mission.id);
        const current = Math.min(metricValue(progress, mission.metric), mission.target);
        const percent = Math.round((current / mission.target) * 100);

        return (
          <li key={mission.id} className={`mission${done ? ' is-done' : ''}`}>
            <div className="mission__head">
              <span className="mission__title">{mission.title}</span>
              <span className="mission__xp">{done ? 'Complete' : `+${mission.xp} XP`}</span>
            </div>
            <p className="mission__detail">{mission.detail}</p>
            <div
              className="xp-bar xp-bar--thin"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label={mission.title}
            >
              <span style={{ width: `${percent}%` }} />
            </div>
            <p className="mission__count">
              {current} / {mission.target}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

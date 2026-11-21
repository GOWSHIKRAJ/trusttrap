import { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { MISSIONS } from '../data/missions';
import GuardianLevel from '../components/command/GuardianLevel';
import ThreatTimeline from '../components/command/ThreatTimeline';
import MissionList from '../components/command/MissionList';
import AchievementGrid from '../components/command/AchievementGrid';
import ActivityFeed from '../components/command/ActivityFeed';
import NameForm from '../components/command/NameForm';
import '../styles/command.css';

function StatTile({ label, value, note }) {
  return (
    <div className="stat-tile">
      <span className="stat-tile__label">{label}</span>
      <span className="stat-tile__value">{value}</span>
      {note && <span className="stat-tile__note">{note}</span>}
    </div>
  );
}

export default function CommandCenterPage() {
  const { progress, level, accuracy, resetProgress } = useProgress();
  const [editingName, setEditingName] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const hasName = Boolean(progress.displayName);
  const showNameForm = !hasName || editingName;

  return (
    <section aria-labelledby="command-title">
      <header className="page-header">
        <p className="eyebrow">Module 00 · Command Center</p>
        <h1 id="command-title">{hasName ? `Welcome back, ${progress.displayName}.` : 'Welcome, Guardian.'}</h1>
        <p className="lede">
          Your investigations, missions and badges. Everything here is stored on this device.
        </p>
      </header>

      {showNameForm && (
        <div className="panel name-panel">
          <div>
            <p className="panel__title">{hasName ? 'Change your name' : 'Set your Guardian name'}</p>
            <p className="muted-note">Your name appears on this dashboard and in the header. No account is needed.</p>
          </div>
          <div>
            <NameForm onDone={() => setEditingName(false)} />
            {hasName && (
              <button type="button" className="btn btn--ghost btn--small name-panel__cancel" onClick={() => setEditingName(false)}>
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      <div className="command-grid">
        <div className="command-grid__main">
          <div className="panel">
            <GuardianLevel level={level} xp={progress.xp} />
            {hasName && !editingName && (
              <button type="button" className="btn btn--ghost btn--small level__edit" onClick={() => setEditingName(true)}>
                Change name
              </button>
            )}
          </div>

          <div className="panel">
            <ThreatTimeline />
          </div>

          <div className="panel">
            <p className="panel__title">Recent activity</p>
            <ActivityFeed events={progress.activity.slice(0, 8)} />
          </div>
        </div>

        <aside className="command-grid__side">
          <div className="stat-tiles">
            <StatTile label="Total XP" value={progress.xp} />
            <StatTile label="Investigations" value={progress.scans} />
            <StatTile
              label="Accuracy"
              value={accuracy === null ? '—' : `${accuracy}%`}
              note={accuracy === null ? 'Earned in challenge modes' : `${progress.answers.correct} of ${progress.answers.total} correct`}
            />
            <StatTile label="Missions done" value={progress.missionsDone.length} note={`of ${MISSIONS.length}`} />
          </div>

          <div className="panel">
            <p className="panel__title">Available missions</p>
            <MissionList progress={progress} />
          </div>
        </aside>
      </div>

      <section className="section-block" aria-labelledby="badges-heading">
        <h2 id="badges-heading" className="section-title">
          Achievements
        </h2>
        <AchievementGrid progress={progress} />
      </section>

      <footer className="reset-row">
        {confirmReset ? (
          <>
            <p>Erase XP, missions, badges, activity and your name on this device?</p>
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
            >
              Yes, erase
            </button>
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" className="btn btn--ghost btn--small" onClick={() => setConfirmReset(true)}>
            Reset local progress
          </button>
        )}
      </footer>
    </section>
  );
}

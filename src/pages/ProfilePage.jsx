import { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { ACHIEVEMENTS } from '../data/achievements';
import { LESSONS } from '../data/lessons';
import { CATEGORIES } from '../data/evidenceCase';
import GuardianLevel from '../components/command/GuardianLevel';
import MissionList from '../components/command/MissionList';
import AchievementGrid from '../components/command/AchievementGrid';
import ActivityFeed from '../components/command/ActivityFeed';
import NameForm from '../components/command/NameForm';
import '../styles/command.css';
import '../styles/profile.css';

function ProfileTile({ label, value, note }) {
  return (
    <div className="stat-tile">
      <span className="stat-tile__label">{label}</span>
      <span className="stat-tile__value">{value}</span>
      {note && <span className="stat-tile__note">{note}</span>}
    </div>
  );
}

export default function ProfilePage() {
  const { progress, level, accuracy } = useProgress();
  const [editing, setEditing] = useState(!progress.displayName);
  const unlocked = progress.achievementsUnlocked.length;

  return (
    <section aria-labelledby="profile-title">
      <header className="profile-hero panel">
        <div>
          <p className="eyebrow">Module 06 · Cyber Guardian profile</p>
          <h1 id="profile-title">{progress.displayName || 'Unnamed Guardian'}</h1>
          <p className="lede">
            Level {level.number} · {level.name}
          </p>
        </div>
        <div className="profile-hero__name">
          {editing ? (
            <NameForm onDone={() => setEditing(false)} />
          ) : (
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setEditing(true)}>
              Change name
            </button>
          )}
        </div>
      </header>

      <div className="profile-grid">
        <div className="panel">
          <GuardianLevel level={level} xp={progress.xp} />
        </div>
        <div className="stat-tiles profile-stats">
          <ProfileTile label="Total XP" value={progress.xp} />
          <ProfileTile
            label="Accuracy"
            value={accuracy === null ? '—' : `${accuracy}%`}
            note={`${progress.answers.correct} of ${progress.answers.total} correct`}
          />
          <ProfileTile label="Investigations" value={progress.scans} />
          <ProfileTile label="Escapes" value={progress.escapes} />
          <ProfileTile label="Lessons" value={`${progress.lessons.length} / ${LESSONS.length}`} />
          <ProfileTile label="Evidence" value={`${progress.evidenceCategories.length} / ${CATEGORIES.length}`} />
        </div>
      </div>

      <div className="profile-grid profile-grid--two">
        <div className="panel">
          <p className="panel__title">Missions</p>
          <MissionList progress={progress} />
        </div>
        <div className="panel">
          <p className="panel__title">Activity log</p>
          <ActivityFeed events={progress.activity} />
        </div>
      </div>

      <section className="section-block" aria-labelledby="profile-badges">
        <h2 id="profile-badges" className="section-title">
          Achievements · {unlocked} of {ACHIEVEMENTS.length} unlocked
        </h2>
        <AchievementGrid progress={progress} />
      </section>
    </section>
  );
}

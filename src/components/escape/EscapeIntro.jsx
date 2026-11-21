import { CLUE_COST, ESCAPE_BASE_XP, ESCAPE_TIME, MISTAKE_PENALTY, STAGE_XP, STORY } from '../../data/escapeContent';

export default function EscapeIntro({ onStart }) {
  return (
    <div className="escape-intro">
      <div className="panel escape-intro__story">
        <p className="eyebrow">The situation</p>
        <p className="escape-intro__text">{STORY}</p>
        <p className="muted-note">
          All scenarios are fictional. Nothing here asks for real passwords, OTPs or financial details.
        </p>
      </div>

      <div className="panel escape-intro__rules">
        <p className="panel__title">Rules of the escape</p>
        <ul className="rules">
          <li>Three locks, opened in order. Each one needs a careful read.</li>
          <li>{ESCAPE_TIME} seconds on the clock for the whole run.</li>
          <li>Each mistake costs {MISTAKE_PENALTY} seconds. Each clue costs {CLUE_COST} seconds.</li>
          <li>
            Each clean lock earns {STAGE_XP} XP. Escaping adds {ESCAPE_BASE_XP} XP, plus a bonus for time left.
          </li>
        </ul>
        <button type="button" className="btn btn--primary btn--xl" onClick={onStart}>
          Begin the escape
        </button>
      </div>
    </div>
  );
}

import { CLUE_COST, ESCAPE_TIME, STAGES } from '../../data/escapeContent';
import { formatTime } from '../../utils/escape';
import FlagDocument from './FlagDocument';
import ChoiceStage from './ChoiceStage';

const LOCK_LABELS = {
  clean: 'Clean',
  done: 'Open',
  active: 'Active',
  locked: 'Sealed',
};

export default function EscapeStage({ stage, state, callbacks }) {
  const cleared = state.phase === 'cleared';
  const isLast = state.stageIndex + 1 === STAGES.length;
  const cluesShown = stage.clues.slice(0, state.clueLevel);
  const canClue = !cleared && state.clueLevel < stage.clues.length;
  const urgent = state.timeLeft <= 30;

  const lockStates = STAGES.map((s, i) => {
    const result = state.results.find((r) => r.stage === s.number);
    if (result) return result.correct ? 'clean' : 'done';
    if (i === state.stageIndex) return 'active';
    return 'locked';
  });

  return (
    <div className="escape-stage">
      <div className="panel escape-hud">
        <div className={`escape-timer${urgent ? ' is-urgent' : ''}`}>
          <span className="escape-timer__label">Time left</span>
          <span className="escape-timer__value">{formatTime(state.timeLeft)}</span>
          <div className="escape-timer__bar" aria-hidden="true">
            <span style={{ width: `${(state.timeLeft / ESCAPE_TIME) * 100}%` }} />
          </div>
        </div>

        <ol className="locks" aria-label="Locks">
          {STAGES.map((s, i) => (
            <li key={s.id} className={`lock lock--${lockStates[i]}`}>
              <span className="lock__number">{s.number}</span>
              <span className="lock__state">{LOCK_LABELS[lockStates[i]]}</span>
            </li>
          ))}
        </ol>

        <p className="escape-hud__mistakes">Mistakes on this lock: {state.mistakes}</p>
      </div>

      <div className="escape-stage__body">
        <div className="panel escape-stage__main">
          <p className="eyebrow">
            Lock {stage.number} of {STAGES.length}
          </p>
          <h2 className="escape-stage__title">{stage.title}</h2>
          <p className="escape-stage__brief">{stage.brief}</p>

          {stage.type === 'flags' ? (
            <FlagDocument stage={stage} state={state} onToggle={callbacks.onToggle} onSubmit={callbacks.onSubmit} />
          ) : (
            <ChoiceStage stage={stage} state={state} onChoose={callbacks.onChoose} />
          )}

          {state.feedback && !cleared && (
            <p className={`escape-feedback is-${state.feedback.type}`} role="status">
              {state.feedback.text}
            </p>
          )}

          {cleared && (
            <div className="escape-cleared" role="status">
              <p className="escape-feedback is-right">{state.feedback.text}</p>
              <button type="button" className="btn btn--primary escape-cleared__next" onClick={callbacks.onContinue}>
                {isLast ? 'Escape the scam' : `Enter lock ${stage.number + 1}`}
              </button>
            </div>
          )}
        </div>

        <aside className="panel escape-stage__clues">
          <p className="panel__title">Clues</p>
          {cluesShown.length === 0 ? (
            <p className="muted-note">No clues revealed yet. Each clue costs {CLUE_COST} seconds.</p>
          ) : (
            <ol className="clue-list">
              {cluesShown.map((clue) => (
                <li key={clue}>{clue}</li>
              ))}
            </ol>
          )}
          <button type="button" className="btn btn--ghost btn--small" onClick={callbacks.onClue} disabled={!canClue}>
            {canClue ? `Reveal a clue (−${CLUE_COST} s)` : 'No clues left'}
          </button>
        </aside>
      </div>
    </div>
  );
}

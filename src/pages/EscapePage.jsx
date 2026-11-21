import { useEffect, useReducer } from 'react';
import { useProgress } from '../context/ProgressContext';
import { STAGES, STAGE_XP } from '../data/escapeContent';
import { INITIAL_ESCAPE, escapeReducer } from '../utils/escape';
import EscapeIntro from '../components/escape/EscapeIntro';
import EscapeStage from '../components/escape/EscapeStage';
import EscapeResult from '../components/escape/EscapeResult';
import '../styles/escape.css';

export default function EscapePage() {
  const [state, dispatch] = useReducer(escapeReducer, INITIAL_ESCAPE);
  const { recordAnswer, recordEscape } = useProgress();

  // The clock only runs while a lock is being worked on.
  useEffect(() => {
    if (state.phase !== 'stage') return undefined;
    const id = window.setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => window.clearInterval(id);
  }, [state.phase]);

  // Each lock result is recorded once: clean locks earn XP, and every lock counts toward accuracy.
  useEffect(() => {
    if (state.results.length === 0) return;
    const last = state.results[state.results.length - 1];
    recordAnswer(last.correct, STAGE_XP);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.results.length]);

  // The run's outcome is recorded once, when it ends.
  useEffect(() => {
    if (state.phase !== 'escaped' && state.phase !== 'trapped') return;
    recordEscape(state.phase === 'escaped', state.escapeXp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  const callbacks = {
    onToggle: (id) => dispatch({ type: 'toggleFlag', id }),
    onSubmit: () => dispatch({ type: 'submitFlags' }),
    onChoose: (id) => dispatch({ type: 'choose', id }),
    onClue: () => dispatch({ type: 'clue' }),
    onContinue: () => dispatch({ type: 'continue' }),
  };

  const stage = STAGES[state.stageIndex];

  return (
    <section aria-labelledby="escape-title">
      <header className="page-header">
        <p className="eyebrow">Module 03 · Escape the Scam</p>
        <h1 id="escape-title">Three locks. One clock.</h1>
        <p className="lede">
          A fictional scam is closing in. Investigate each lock and get out before time runs out.
        </p>
      </header>

      {state.phase === 'intro' && <EscapeIntro onStart={() => dispatch({ type: 'start' })} />}

      {(state.phase === 'stage' || state.phase === 'cleared') && (
        <EscapeStage key={stage.id} stage={stage} state={state} callbacks={callbacks} />
      )}

      {(state.phase === 'escaped' || state.phase === 'trapped') && (
        <EscapeResult state={state} onReplay={() => dispatch({ type: 'start' })} />
      )}
    </section>
  );
}

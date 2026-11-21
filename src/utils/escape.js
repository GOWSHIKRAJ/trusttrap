/*
 * Escape the Scam state machine. Pure reducer: no timers, no storage.
 * The page owns the clock and dispatches a 'tick' every second.
 */
import { STAGES, ESCAPE_TIME, MISTAKE_PENALTY, CLUE_COST, ESCAPE_BASE_XP } from '../data/escapeContent';

export const INITIAL_ESCAPE = {
  phase: 'intro', // intro | stage | cleared | escaped | trapped
  stageIndex: 0,
  timeLeft: ESCAPE_TIME,
  mistakes: 0,
  totalMistakes: 0,
  clueLevel: 0,
  flagged: [],
  eliminated: [],
  results: [], // { stage, correct, timedOut }
  feedback: null, // { type: 'wrong' | 'right', text }
  escapeXp: 0,
};

export function formatTime(seconds) {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
}

function stageOf(state) {
  return STAGES[state.stageIndex];
}

function trap(state) {
  return {
    ...state,
    phase: 'trapped',
    timeLeft: 0,
    results: [...state.results, { stage: stageOf(state).number, correct: false, timedOut: true }],
    feedback: { type: 'wrong', text: 'Time ran out before the lock opened.' },
  };
}

/** Removes seconds from the clock. Reaching zero traps the player. */
function spend(state, seconds) {
  const timeLeft = state.timeLeft - seconds;
  if (timeLeft <= 0) return trap({ ...state, timeLeft: 0 });
  return { ...state, timeLeft };
}

function solve(state) {
  const stage = stageOf(state);
  return {
    ...state,
    phase: 'cleared',
    results: [...state.results, { stage: stage.number, correct: state.mistakes === 0, timedOut: false }],
    feedback: { type: 'right', text: stage.success },
  };
}

/** A flags lock is solved when the flagged lines are exactly the red-flag lines. */
export function isFlagSolved(stage, flagged) {
  const red = stage.lines.filter((line) => line.red).map((line) => line.id).sort();
  const picked = [...flagged].sort();
  return red.length === picked.length && red.every((id, i) => id === picked[i]);
}

export function escapeReducer(state, action) {
  switch (action.type) {
    case 'start':
      return { ...INITIAL_ESCAPE, phase: 'stage' };

    case 'tick':
      if (state.phase !== 'stage') return state;
      return spend(state, 1);

    case 'toggleFlag': {
      if (state.phase !== 'stage' || stageOf(state).type !== 'flags') return state;
      const flagged = state.flagged.includes(action.id)
        ? state.flagged.filter((id) => id !== action.id)
        : [...state.flagged, action.id];
      return { ...state, flagged, feedback: null };
    }

    case 'submitFlags': {
      if (state.phase !== 'stage') return state;
      const stage = stageOf(state);
      if (stage.type !== 'flags') return state;
      if (isFlagSolved(stage, state.flagged)) return solve(state);

      const red = stage.lines.filter((line) => line.red).map((line) => line.id);
      const hits = state.flagged.filter((id) => red.includes(id)).length;
      const falsePositives = state.flagged.length - hits;
      const missed = red.length - hits;
      const next = {
        ...state,
        mistakes: state.mistakes + 1,
        totalMistakes: state.totalMistakes + 1,
        feedback: {
          type: 'wrong',
          text: `${hits} of ${red.length} red flags found, ${falsePositives} safe ${falsePositives === 1 ? 'line' : 'lines'} flagged, ${missed} still hidden. ${MISTAKE_PENALTY} seconds lost.`,
        },
      };
      return spend(next, MISTAKE_PENALTY);
    }

    case 'choose': {
      if (state.phase !== 'stage') return state;
      const stage = stageOf(state);
      if (stage.type !== 'choice') return state;
      const option = stage.options.find((o) => o.id === action.id);
      if (!option || state.eliminated.includes(option.id)) return state;
      if (option.correct) return solve(state);

      const next = {
        ...state,
        eliminated: [...state.eliminated, option.id],
        mistakes: state.mistakes + 1,
        totalMistakes: state.totalMistakes + 1,
        feedback: { type: 'wrong', text: `${option.feedback} ${MISTAKE_PENALTY} seconds lost.` },
      };
      return spend(next, MISTAKE_PENALTY);
    }

    case 'clue': {
      if (state.phase !== 'stage') return state;
      if (state.clueLevel >= stageOf(state).clues.length) return state;
      return spend({ ...state, clueLevel: state.clueLevel + 1 }, CLUE_COST);
    }

    case 'continue': {
      if (state.phase !== 'cleared') return state;
      const isLast = state.stageIndex + 1 >= STAGES.length;
      if (isLast) {
        return {
          ...state,
          phase: 'escaped',
          feedback: null,
          escapeXp: ESCAPE_BASE_XP + Math.floor(state.timeLeft / 3),
        };
      }
      return {
        ...state,
        phase: 'stage',
        stageIndex: state.stageIndex + 1,
        mistakes: 0,
        clueLevel: 0,
        flagged: [],
        eliminated: [],
        feedback: null,
      };
    }

    default:
      return state;
  }
}

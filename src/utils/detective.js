/*
 * Cyber Detective logic. Pure functions only: building rounds, scoring answers and the session reducer.
 * The UI lives in components/detective and pages/DetectivePage.jsx.
 */
import { SCENARIOS } from '../data/detectiveScenarios';

export const DIFFICULTY_ORDER = ['beginner', 'intermediate', 'expert'];

export const DIFFICULTIES = {
  beginner: {
    key: 'beginner',
    label: 'Beginner',
    detail: 'Three choices per scenario. Hints are available. No timer.',
    choiceCount: 3,
    timerSeconds: null,
    hintsAllowed: true,
    xp: 5,
  },
  intermediate: {
    key: 'intermediate',
    label: 'Intermediate',
    detail: 'Four choices per scenario. No hints. No timer.',
    choiceCount: 4,
    timerSeconds: null,
    hintsAllowed: false,
    xp: 10,
  },
  expert: {
    key: 'expert',
    label: 'Expert',
    detail: 'Four choices per scenario. No hints. Twenty seconds for each decision.',
    choiceCount: 4,
    timerSeconds: 20,
    hintsAllowed: false,
    xp: 15,
  },
};

export const INITIAL_SESSION = {
  phase: 'setup',
  difficulty: null,
  questions: [],
  index: 0,
  answers: [],
};

export function shuffle(items, rng = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Removes wrong choices until the count matches. Weak distractors are removed first. Correct choices never are. */
function trimChoices(choices, count) {
  const trimmed = [...choices];
  while (trimmed.length > count) {
    let index = trimmed.findIndex((choice) => choice.weak && !choice.correct);
    if (index === -1) index = trimmed.findIndex((choice) => !choice.correct);
    trimmed.splice(index, 1);
  }
  return trimmed;
}

/** Builds one round: every scenario once, in random order, with choices trimmed and shuffled for the difficulty. */
export function buildQuestions(difficulty, rng = Math.random) {
  const config = DIFFICULTIES[difficulty];
  if (!config) return [];
  return shuffle(SCENARIOS, rng).map((scenario) => ({
    id: scenario.id,
    scenario,
    choices: shuffle(trimChoices(scenario.choices, config.choiceCount), rng),
  }));
}

export function summarize(answers) {
  const correct = answers.filter((answer) => answer.correct).length;
  const total = answers.length;
  return {
    correct,
    incorrect: total - correct,
    total,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    xp: answers.reduce((sum, answer) => sum + answer.xp, 0),
  };
}

/**
 * Session reducer.
 * start:  { difficulty, questions }   begins a round with questions built by the caller
 * answer: { choiceId }                choiceId is null when the timer runs out
 * next:                               moves on, or finishes the round after the last scenario
 * restart:                            returns to difficulty selection
 */
export function detectiveReducer(state, action) {
  switch (action.type) {
    case 'start':
      return {
        phase: 'playing',
        difficulty: action.difficulty,
        questions: action.questions,
        index: 0,
        answers: [],
      };

    case 'answer': {
      // Ignore answers when the round is not active or the current scenario is already answered.
      if (state.phase !== 'playing' || state.answers.length !== state.index) return state;

      const question = state.questions[state.index];
      const choice = action.choiceId ? question.choices.find((c) => c.id === action.choiceId) : null;
      const correct = Boolean(choice?.correct);
      const config = DIFFICULTIES[state.difficulty];

      const answer = {
        questionId: question.id,
        choiceId: choice ? choice.id : null,
        correct,
        timedOut: !choice,
        xp: correct ? config.xp : 0,
      };
      return { ...state, answers: [...state.answers, answer] };
    }

    case 'next': {
      if (state.phase !== 'playing' || state.answers.length <= state.index) return state;
      const isLast = state.index + 1 >= state.questions.length;
      return isLast ? { ...state, phase: 'summary' } : { ...state, index: state.index + 1 };
    }

    case 'restart':
      return INITIAL_SESSION;

    default:
      return state;
  }
}

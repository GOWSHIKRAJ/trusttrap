// Learning progress is stored only in LocalStorage. No messages, passwords or personal inputs are saved.
const KEY = 'trusttrap:progress:v2';
const EVENT = 'trusttrap:progress';

const DEFAULT_PROGRESS = {
  simulations: 0,
  safeDecisions: 0,
  unsafeDecisions: 0,
  analyses: 0,
  activities: 0,
  lessons: {},   // { [lessonId]: true }
  quizzes: {},   // { [lessonId]: percentScore }
};

export function loadProgress() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_PROGRESS);
    return { ...structuredClone(DEFAULT_PROGRESS), ...JSON.parse(raw) };
  } catch {
    return structuredClone(DEFAULT_PROGRESS);
  }
}

function save(progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    /* storage may be full or blocked; progress simply will not persist */
  }
}

export function updateProgress(mutator) {
  const next = mutator(loadProgress());
  save(next);
  window.dispatchEvent(new Event(EVENT));
  return next;
}

export function resetProgress() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

export const PROGRESS_EVENT = EVENT;

export const BADGES = [
  {
    id: 'first-defender',
    name: 'First Defender',
    description: 'Complete your first simulation or message analysis.',
    unlocked: (p) => p.simulations + p.analyses >= 1,
  },
  {
    id: 'phishing-detective',
    name: 'Phishing Detective',
    description: 'Answer the phishing lesson quiz correctly.',
    unlocked: (p) => p.quizzes.phishing === 100,
  },
  {
    id: 'password-protector',
    name: 'Password Protector',
    description: 'Complete the password security lesson.',
    unlocked: (p) => !!p.lessons.passwords,
  },
  {
    id: 'safe-browser',
    name: 'Safe Browser',
    description: 'Complete the safe browsing lesson.',
    unlocked: (p) => !!p.lessons['safe-browsing'],
  },
  {
    id: 'cyber-guardian',
    name: 'Cyber Guardian',
    description: 'Complete 5 lessons.',
    unlocked: (p) => Object.keys(p.lessons).length >= 5,
  },
  {
    id: 'digital-safety-champion',
    name: 'Digital Safety Champion',
    description: 'Complete all 10 lessons.',
    unlocked: (p) => Object.keys(p.lessons).length >= 10,
  },
];

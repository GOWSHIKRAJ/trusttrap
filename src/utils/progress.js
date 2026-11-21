/*
 * Shared progress logic for the Cyber Guardian profile.
 * Every function is pure: it takes a progress object and returns a new one.
 * context/ProgressContext.jsx is the only place that stores it.
 */
import { MISSIONS } from '../data/missions';
import { ACHIEVEMENTS } from '../data/achievements';

export const SCAN_XP = 10;
export const ANSWER_XP = 5;
export const LESSON_XP = 20;
export const EVIDENCE_CATEGORY_XP = 10;
export const MAX_SEEN = 200;
export const MAX_ACTIVITY = 20;
export const NAME_PATTERN = /^[A-Za-z0-9 _-]+$/;

export const LEVELS = [
  { name: 'Watcher', min: 0 },
  { name: 'Sentinel', min: 150 },
  { name: 'Guardian', min: 400 },
  { name: 'Warden', min: 800 },
  { name: 'Sentinel Prime', min: 1500 },
];

const COUNTER_KEYS = ['xp', 'scans', 'criticalScans', 'linkScans', 'pressureScans', 'credentialScans', 'escapes'];
const LIST_KEYS = [
  'missionsDone',
  'achievementsUnlocked',
  'seenHashes',
  'activity',
  'lessons',
  'evidenceItems',
  'evidenceCategories',
];

export function createInitialProgress() {
  return {
    displayName: '',
    xp: 0,
    scans: 0,
    criticalScans: 0,
    linkScans: 0,
    pressureScans: 0,
    credentialScans: 0,
    escapes: 0,
    answers: { correct: 0, total: 0 },
    missionsDone: [],
    achievementsUnlocked: [],
    seenHashes: [],
    activity: [],
    lessons: [],
    evidenceItems: [],
    evidenceCategories: [],
  };
}

/** Fills in any missing fields so partial or older saved data never breaks the UI. */
export function mergeProgress(stored) {
  const base = createInitialProgress();
  if (!stored || typeof stored !== 'object') return base;

  const merged = {
    ...base,
    ...stored,
    answers: { ...base.answers, ...(stored.answers ?? {}) },
  };
  for (const key of COUNTER_KEYS) {
    if (typeof merged[key] !== 'number') merged[key] = 0;
  }
  for (const key of LIST_KEYS) {
    if (!Array.isArray(merged[key])) merged[key] = [];
  }
  if (typeof merged.displayName !== 'string') merged.displayName = '';
  return merged;
}

export function getLevel(xp) {
  let index = 0;
  LEVELS.forEach((level, i) => {
    if (xp >= level.min) index = i;
  });
  const current = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  const span = next ? next.min - current.min : 1;
  return {
    number: index + 1,
    name: current.name,
    next,
    fraction: next ? Math.min(1, (xp - current.min) / span) : 1,
    xpToNext: next ? next.min - xp : 0,
  };
}

/** Whole-number percentage, or null when no challenges have been answered yet. */
export function getAccuracy(answers) {
  return answers.total > 0 ? Math.round((answers.correct / answers.total) * 100) : null;
}

export function metricValue(progress, metric) {
  if (metric === 'correctAnswers') return progress.answers.correct;
  if (metric === 'lessons') return progress.lessons.length;
  if (metric === 'evidenceCategories') return progress.evidenceCategories.length;
  return progress[metric] ?? 0;
}

/** Returns { name } when valid, or { error } with a message for the user. */
export function validateDisplayName(raw = '') {
  const name = raw.trim().replace(/\s+/g, ' ');
  if (name.length < 2) return { error: 'Use at least 2 characters.' };
  if (name.length > 20) return { error: 'Keep it under 20 characters.' };
  if (!NAME_PATTERN.test(name)) return { error: 'Use letters, numbers, spaces, hyphens or underscores.' };
  return { name };
}

/** Stable fingerprint of a message. Only this hash is stored, never the text. */
export function fingerprint(text) {
  const normalized = text.trim().toLowerCase().replace(/\s+/g, ' ');
  let hash = 5381;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = ((hash << 5) + hash + normalized.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

function makeEvent(text, xp = 0) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    xp,
    at: new Date().toISOString(),
  };
}

/** Completes any missions and unlocks any badges whose conditions are now met. */
export function settle(progress) {
  let next = { ...progress };
  const events = [];

  for (const mission of MISSIONS) {
    if (next.missionsDone.includes(mission.id)) continue;
    if (metricValue(next, mission.metric) < mission.target) continue;
    next = { ...next, missionsDone: [...next.missionsDone, mission.id], xp: next.xp + mission.xp };
    events.push(makeEvent(`Mission complete: ${mission.title}`, mission.xp));
  }

  for (const badge of ACHIEVEMENTS) {
    if (next.achievementsUnlocked.includes(badge.id)) continue;
    if (metricValue(next, badge.metric) < badge.target) continue;
    next = { ...next, achievementsUnlocked: [...next.achievementsUnlocked, badge.id] };
    events.push(makeEvent(`Badge unlocked: ${badge.title}`));
  }

  if (events.length > 0) {
    next.activity = [...events, ...next.activity].slice(0, MAX_ACTIVITY);
  }
  return next;
}

/** Records one scanner result. Returns the same object if the message was already investigated. */
export function applyScan(progress, analysis, text) {
  if (analysis.status !== 'ok') return progress;

  const hash = fingerprint(text);
  if (progress.seenHashes.includes(hash)) return progress;

  const ids = new Set(analysis.flags.map((f) => f.id));
  const categories = new Set(analysis.flags.map((f) => f.category));
  const hasPressure = ['urgency', 'threat', 'secrecy'].some((id) => ids.has(id));
  const hasCredentialAsk = ids.has('otp') || ids.has('credentials');

  const next = {
    ...progress,
    scans: progress.scans + 1,
    criticalScans: progress.criticalScans + (analysis.level.key === 'CRITICAL' ? 1 : 0),
    linkScans: progress.linkScans + (categories.has('Suspicious links') ? 1 : 0),
    pressureScans: progress.pressureScans + (hasPressure ? 1 : 0),
    credentialScans: progress.credentialScans + (hasCredentialAsk ? 1 : 0),
    xp: progress.xp + SCAN_XP,
    seenHashes: [hash, ...progress.seenHashes].slice(0, MAX_SEEN),
    activity: [
      makeEvent(`Investigated a message: ${analysis.level.label}, score ${analysis.score}`, SCAN_XP),
      ...progress.activity,
    ].slice(0, MAX_ACTIVITY),
  };
  return settle(next);
}

/** Records one answered challenge, used by Cyber Detective and Escape the Scam. */
export function applyAnswer(progress, correct, xp = ANSWER_XP) {
  const next = {
    ...progress,
    answers: {
      correct: progress.answers.correct + (correct ? 1 : 0),
      total: progress.answers.total + 1,
    },
    xp: progress.xp + (correct ? xp : 0),
    activity: [
      makeEvent(correct ? 'Answered a challenge correctly' : 'Answered a challenge incorrectly', correct ? xp : 0),
      ...progress.activity,
    ].slice(0, MAX_ACTIVITY),
  };
  return settle(next);
}

/** Records the end of an Escape the Scam run. */
export function applyEscape(progress, escaped, xp = 0) {
  const next = {
    ...progress,
    escapes: progress.escapes + (escaped ? 1 : 0),
    xp: progress.xp + (escaped ? xp : 0),
    activity: [
      makeEvent(
        escaped ? 'Escaped the scam before time ran out' : 'Trapped by the scam. Replay to try again',
        escaped ? xp : 0
      ),
      ...progress.activity,
    ].slice(0, MAX_ACTIVITY),
  };
  return settle(next);
}

/** Records a lesson as completed. Each lesson pays out once. */
export function applyLesson(progress, lessonId, title) {
  if (progress.lessons.includes(lessonId)) return progress;
  const next = {
    ...progress,
    lessons: [...progress.lessons, lessonId],
    xp: progress.xp + LESSON_XP,
    activity: [makeEvent(`Lesson complete: ${title}`, LESSON_XP), ...progress.activity].slice(0, MAX_ACTIVITY),
  };
  return settle(next);
}

/** Records one examined evidence item. A category pays out once, when all its items are examined. */
export function applyEvidenceItem(progress, itemId, category) {
  if (progress.evidenceItems.includes(itemId)) return progress;

  let next = { ...progress, evidenceItems: [...progress.evidenceItems, itemId] };
  const complete = category.itemIds.every((id) => next.evidenceItems.includes(id));

  if (complete && !next.evidenceCategories.includes(category.id)) {
    next = {
      ...next,
      evidenceCategories: [...next.evidenceCategories, category.id],
      xp: next.xp + EVIDENCE_CATEGORY_XP,
      activity: [
        makeEvent(`Examined evidence: ${category.label}`, EVIDENCE_CATEGORY_XP),
        ...next.activity,
      ].slice(0, MAX_ACTIVITY),
    };
  }
  return settle(next);
}

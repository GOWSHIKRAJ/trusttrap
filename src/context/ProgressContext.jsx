import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  applyAnswer,
  applyEscape,
  applyEvidenceItem,
  applyLesson,
  applyScan,
  createInitialProgress,
  getAccuracy,
  getLevel,
  mergeProgress,
  validateDisplayName,
} from '../utils/progress';

const STORAGE_KEY = 'trusttrap.progress';
const ProgressContext = createContext(null);

/** Holds the Guardian profile for the whole app and saves it to LocalStorage. */
export function ProgressProvider({ children }) {
  const [stored, setStored] = useLocalStorage(STORAGE_KEY, null);
  const progress = useMemo(() => mergeProgress(stored), [stored]);

  // Returns an error message, or an empty string on success.
  const setDisplayName = useCallback(
    (raw) => {
      const result = validateDisplayName(raw);
      if (result.error) return result.error;
      setStored({ ...progress, displayName: result.name });
      return '';
    },
    [progress, setStored]
  );

  // Returns the XP gained. Zero means the message was already investigated.
  const recordScan = useCallback(
    (analysis, text) => {
      const next = applyScan(progress, analysis, text);
      if (next === progress) return 0;
      setStored(next);
      return next.xp - progress.xp;
    },
    [progress, setStored]
  );

  const recordAnswer = useCallback(
    (correct, xp) => {
      setStored(applyAnswer(progress, correct, xp));
    },
    [progress, setStored]
  );

  const recordEscape = useCallback(
    (escaped, xp) => {
      setStored(applyEscape(progress, escaped, xp));
    },
    [progress, setStored]
  );

  // Returns true when the lesson was newly completed.
  const completeLesson = useCallback(
    (lesson) => {
      const next = applyLesson(progress, lesson.id, lesson.title);
      if (next === progress) return false;
      setStored(next);
      return true;
    },
    [progress, setStored]
  );

  const revealEvidence = useCallback(
    (itemId, category) => {
      const next = applyEvidenceItem(progress, itemId, category);
      if (next !== progress) setStored(next);
    },
    [progress, setStored]
  );

  const resetProgress = useCallback(() => {
    setStored(createInitialProgress());
  }, [setStored]);

  const value = useMemo(
    () => ({
      progress,
      level: getLevel(progress.xp),
      accuracy: getAccuracy(progress.answers),
      setDisplayName,
      recordScan,
      recordAnswer,
      recordEscape,
      completeLesson,
      revealEvidence,
      resetProgress,
    }),
    [progress, setDisplayName, recordScan, recordAnswer, recordEscape, completeLesson, revealEvidence, resetProgress]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used inside ProgressProvider');
  }
  return context;
}

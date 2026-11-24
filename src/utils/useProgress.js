import { useEffect, useState } from 'react';
import { loadProgress, PROGRESS_EVENT } from './progress.js';

/** Subscribes a component to LocalStorage progress changes, including from other tabs. */
export default function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    const refresh = () => setProgress(loadProgress());
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return progress;
}

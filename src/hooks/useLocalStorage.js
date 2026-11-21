import { useEffect, useState } from 'react';

/** useState backed by localStorage. Falls back safely if storage is unavailable. */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or disabled. The app keeps working in memory.
    }
  }, [key, value]);

  return [value, setValue];
}

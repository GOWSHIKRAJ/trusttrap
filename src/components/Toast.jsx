import { useEffect } from 'react';

export default function Toast({ message, onDone, duration = 2600 }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(id);
  }, [message, onDone, duration]);

  if (!message) return null;
  return <div className="toast" role="status" aria-live="polite">{message}</div>;
}

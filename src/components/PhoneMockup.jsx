import { useEffect, useState } from 'react';

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/** Realistic phone frame built with HTML and CSS. Children render inside the screen. */
export default function PhoneMockup({ children, className = '', label = 'Smartphone simulation' }) {
  const now = useClock();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className={`phone ${className}`} role="group" aria-label={label}>
      <span className="phone-button phone-button-vol-up" aria-hidden="true" />
      <span className="phone-button phone-button-vol-down" aria-hidden="true" />
      <span className="phone-button phone-button-power" aria-hidden="true" />
      <div className="phone-screen">
        <div className="phone-island" aria-hidden="true" />
        <div className="status-bar" aria-hidden="true">
          <span>{time}</span>
          <span className="status-icons">5G &#9679;&#9679;&#9679; 84%</span>
        </div>
        {children}
        {/* Use the date in a visually hidden element so screen readers announce the current time context */}
        <span className="sr-only">{date}</span>
      </div>
    </div>
  );
}

export function LockScreenClock() {
  const now = useClock();
  return (
    <div className="lock-clock">
      <div className="lock-date">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      <div className="lock-time">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
    </div>
  );
}

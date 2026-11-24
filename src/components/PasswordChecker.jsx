import { useMemo, useState } from 'react';

// Local-only evaluation. The value lives in component state and is never stored or transmitted.
const COMMON = ['password', 'password123', 'qwerty', 'letmein', 'welcome', 'admin', 'summer2024', 'india123', 'iloveyou'];

function evaluate(pw) {
  if (!pw) return { score: 0, label: 'Start typing', tips: [] };
  const tips = [];
  let score = 0;
  if (pw.length >= 12) score += 35; else tips.push('Use at least 12 characters. Length matters most.');
  if (pw.length >= 16) score += 10;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 15; else tips.push('Mix upper- and lower-case letters.');
  if (/\d/.test(pw)) score += 10; else tips.push('Add numbers.');
  if (/[^A-Za-z0-9]/.test(pw)) score += 10; else tips.push('Add a symbol, or better, use several unrelated words.');
  if (new Set(pw).size / pw.length > 0.6) score += 10;
  if (COMMON.some((c) => pw.toLowerCase().includes(c))) { score -= 30; tips.push('Avoid common words or patterns like "password" or "123".'); }
  if (/(.)\1{2,}/.test(pw)) { score -= 10; tips.push('Avoid repeated characters.'); }
  score = Math.max(0, Math.min(100, score));
  const label = score >= 80 ? 'Strong' : score >= 55 ? 'Good' : score >= 30 ? 'Weak' : 'Very weak';
  return { score, label, tips };
}

export default function PasswordChecker({ onUse }) {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);
  const result = useMemo(() => evaluate(value), [value]);

  return (
    <div className="pw-checker">
      <label htmlFor="pw-input" className="field-label">Try a sample password (it is checked only in your browser)</label>
      <div className="pw-row">
        <input
          id="pw-input"
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="Try something like a passphrase"
        />
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setVisible((v) => !v)} aria-pressed={visible}>
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      <p className="hint">Never use a real password here. Nothing you type is saved or sent anywhere.</p>
      <div className="pw-meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={result.score} aria-label="Password strength">
        <div className={`pw-fill s-${result.score >= 80 ? 'strong' : result.score >= 55 ? 'good' : result.score >= 30 ? 'weak' : 'very'}`} style={{ width: `${result.score}%` }} />
      </div>
      <p className="pw-label"><strong>{result.label}</strong></p>
      {result.tips.length > 0 && (
        <ul className="pw-tips">{result.tips.map((t) => <li key={t}>{t}</li>)}</ul>
      )}
      {onUse && <button type="button" className="btn btn-ghost btn-sm" onClick={onUse}>Mark activity complete</button>}
    </div>
  );
}

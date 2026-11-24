import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RiskMeter from '../components/RiskMeter.jsx';
import Toast from '../components/Toast.jsx';
import { SAMPLE_MESSAGES } from '../data/scenarios.js';
import { RULES } from '../data/detectionRules.js';
import { analyzeMessage, buildSummary } from '../utils/scamAnalyzer.js';
import { updateProgress } from '../utils/progress.js';

const MAX_CHARS = 2000;
const RULE_NAMES = Object.fromEntries(RULES.map((r) => [r.id, r.name]));

export default function ThreatAnalyzer() {
  const location = useLocation();
  const [input, setInput] = useState(() => location.state?.text ?? '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeRule, setActiveRule] = useState(null);
  const [toast, setToast] = useState('');
  const [exampleId, setExampleId] = useState('');

  const clearToast = useCallback(() => setToast(''), []);

  const analyze = () => {
    if (!input.trim()) {
      setError('Paste or type a message first. Nothing is analysed until there is text to check.');
      setResult(null);
      return;
    }
    setError('');
    setActiveRule(null);
    setResult(analyzeMessage(input));
    updateProgress((p) => ({ ...p, analyses: p.analyses + 1 }));
  };

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInput(text.slice(0, MAX_CHARS));
      else setToast('Clipboard is empty.');
    } catch {
      setToast('Paste is blocked by your browser. Use Ctrl+V or Cmd+V in the box.');
    }
  };

  const clear = () => {
    setInput('');
    setResult(null);
    setError('');
    setActiveRule(null);
    setExampleId('');
  };

  const pickExample = (id) => {
    setExampleId(id);
    const ex = SAMPLE_MESSAGES.find((m) => m.id === id);
    if (ex) {
      setInput(ex.text);
      setResult(null);
      setError('');
      setActiveRule(null);
    }
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary(result));
      setToast('Analysis summary copied.');
    } catch {
      setToast('Copy failed. You can select the summary and copy it manually.');
    }
  };

  const scanAnother = () => {
    clear();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFinding = useMemo(
    () => result?.findings.find((f) => f.id === activeRule) ?? null,
    [result, activeRule]
  );

  return (
    <div className="page-shell container">
      <header className="page-head">
        <p className="eyebrow">Analyze</p>
        <h1>Threat Analyzer</h1>
        <p className="lead">
          Paste any suspicious message. The rules check it in your browser and explain every warning sign.
          The message is never sent anywhere or saved.
        </p>
      </header>

      <div className="analyzer">
        <section className="analyzer-input" aria-labelledby="input-title">
          <h2 id="input-title" className="panel-title">1 · Message</h2>

          <label htmlFor="example-select" className="field-label">Try an example</label>
          <select id="example-select" value={exampleId} onChange={(e) => pickExample(e.target.value)}>
            <option value="">Choose a fictional example…</option>
            {SAMPLE_MESSAGES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>

          <label htmlFor="message-input" className="field-label">Message text</label>
          <textarea
            id="message-input"
            value={input}
            maxLength={MAX_CHARS}
            onChange={(e) => { setInput(e.target.value); setError(''); }}
            rows={9}
            placeholder="Paste the message here…"
            aria-describedby="input-help input-error"
            aria-invalid={!!error}
          />
          <div className="input-meta">
            <span id="input-help">{input.length}/{MAX_CHARS} characters</span>
          </div>
          {error && <p id="input-error" className="form-error" role="alert">{error}</p>}

          <div className="input-actions">
            <button type="button" className="btn btn-primary" onClick={analyze}>Analyze message</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={paste}>Paste</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>Clear</button>
          </div>

          <p className="hint limits">
            This analyzer checks text patterns only. It cannot confirm whether a link or file contains malware, and it cannot verify websites.
          </p>
        </section>

        <section className="analyzer-result" aria-labelledby="result-title" aria-live="polite">
          <h2 id="result-title" className="panel-title">2 · Report</h2>

          {!result && (
            <div className="result-empty">
              <p>Your report appears here: a risk score, the warning signs found and what to do next.</p>
            </div>
          )}

          {result && (
            <div className="report">
              <div className="report-head">
                <div>
                  <p className="verdict-label">{result.verdict}</p>
                  <p className="score"><strong>{result.score}</strong><span>/100</span> · <span className={`pill level-${result.level}`}>{result.label}</span></p>
                </div>
              </div>
              <RiskMeter score={result.score} level={result.level} />
              <p className="level-text">{result.levelText}</p>

              <h3 className="sub-title">Your message, highlighted</h3>
              <p className="highlight-text">
                {result.segments.map((seg, i) =>
                  seg.ruleId ? (
                    <button
                      key={i}
                      type="button"
                      className={`hl hl-${seg.ruleId} ${activeRule === seg.ruleId ? 'active' : ''}`}
                      onClick={() => setActiveRule(activeRule === seg.ruleId ? null : seg.ruleId)}
                      onMouseEnter={() => setActiveRule(seg.ruleId)}
                      aria-pressed={activeRule === seg.ruleId}
                      aria-label={`${seg.text}. ${RULE_NAMES[seg.ruleId]}. Activate for explanation.`}
                    >
                      {seg.text}
                    </button>
                  ) : (
                    <span key={i}>{seg.text}</span>
                  )
                )}
              </p>

              <div className="explain-box" aria-live="polite">
                {activeFinding ? (
                  <>
                    <p className="explain-title">{activeFinding.name} <span className="weight">+{activeFinding.weight}</span></p>
                    <p>{activeFinding.explanation}</p>
                  </>
                ) : (
                  <p className="muted">Click or hover a highlighted phrase to see why it matters.</p>
                )}
              </div>

              <h3 className="sub-title">Warning signs</h3>
              {result.findings.length === 0 ? (
                <p className="muted">No rule matched. This does not prove a message is safe. Stay cautious with unexpected messages.</p>
              ) : (
                <ul className="findings">
                  {result.findings.map((f) => (
                    <li key={f.id}>
                      <div className="finding-head">
                        <strong>{f.name}</strong>
                        <span className="weight">+{f.weight}</span>
                      </div>
                      <p>{f.explanation}</p>
                      <p className="found-phrases">Found: {f.phrases.map((p) => `“${p}”`).join(', ')}</p>
                    </li>
                  ))}
                </ul>
              )}

              <h3 className="sub-title">What could happen if you interact</h3>
              <p>
                {result.level === 'low'
                  ? 'Probably little, but a link or reply can still expose details if the sender is not who they claim.'
                  : 'You could land on a fake page that records your details, pay someone you should not pay, or install software that harms your device.'}
              </p>

              <div className="recommend">
                <h3 className="sub-title">Recommended action</h3>
                <p>{result.recommendedAction}</p>
              </div>

              <div className="report-actions">
                <button type="button" className="btn btn-cobalt btn-sm" onClick={copySummary}>Copy analysis summary</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={scanAnother}>Scan another message</button>
              </div>

              <p className="hint">Scoring: each matched rule adds its weight. The total is capped at 100. Levels: 0–24 low, 25–49 medium, 50–74 high, 75–100 critical.</p>
            </div>
          )}
        </section>
      </div>

      <Toast message={toast} onDone={clearToast} />
    </div>
  );
}

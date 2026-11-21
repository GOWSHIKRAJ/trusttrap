import { useState } from 'react';
import { analyzeMessage, MIN_ANALYSIS_LENGTH, RISK_LEVELS, SCORING_RULES } from '../utils/scamEngine';
import { SAMPLE_MESSAGES } from '../data/sampleMessages';
import useLocalStorage from '../hooks/useLocalStorage';
import { useProgress } from '../context/ProgressContext';
import ScanReport from '../components/scanner/ScanReport';
import '../styles/command.css';

const MAX_CHARS = 2000;
const HISTORY_LIMIT = 12;

export default function ScannerPage() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [activeSampleId, setActiveSampleId] = useState(null);
  const [history, setHistory] = useLocalStorage('trusttrap.scanHistory', []);
  const { recordScan } = useProgress();

  async function handleAnalyze() {
    if (isAnalyzing) return;

    const text = input.trim();
    if (!text) {
      setError('Paste a suspicious message to begin the investigation.');
      return;
    }
    if (text.length < MIN_ANALYSIS_LENGTH) {
      setError(`Add a little more context. At least ${MIN_ANALYSIS_LENGTH} characters are needed.`);
      return;
    }

    setError('');
    setAnalysis(null);
    setIsAnalyzing(true);

    // Short deliberate delay so the scan feels like an investigation. The result itself is instant.
    await new Promise((resolve) => setTimeout(resolve, 650));

    const result = analyzeMessage(text);
    // XP is 0 when the same message was already investigated.
    const reward = result.status === 'ok' ? recordScan(result, text) : 0;
    setAnalysis({ ...result, reward });
    setIsAnalyzing(false);

    if (result.status === 'ok') {
      // Only the outcome is stored, never the message content.
      setHistory((prev) =>
        [
          {
            id: Date.now(),
            score: result.score,
            level: result.level.label,
            tone: result.level.tone,
            flagCount: result.flags.length,
            at: new Date().toISOString(),
          },
          ...prev,
        ].slice(0, HISTORY_LIMIT)
      );
    }
  }

  function handleSample(sample) {
    setInput(sample.text);
    setActiveSampleId(sample.id);
    setAnalysis(null);
    setError('');
  }

  function handleClear() {
    setInput('');
    setActiveSampleId(null);
    setAnalysis(null);
    setError('');
  }

  function handleKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      handleAnalyze();
    }
  }

  return (
    <section className="scanner" aria-labelledby="scanner-title">
      <header className="page-header">
        <p className="eyebrow">Module 01 · Scam Scanner</p>
        <h1 id="scanner-title">Drop the message in. See the traps.</h1>
        <p className="lede">
          Paste an SMS, WhatsApp message, email or job offer. The rule-based engine explains every warning sign it
          finds and why it matters.
        </p>
      </header>

      <div className="scanner__grid">
        <div className="panel composer">
          <div className="composer__head">
            <label htmlFor="message-input">Suspicious message</label>
            <span className="counter">
              {input.length} / {MAX_CHARS}
            </span>
          </div>

          <textarea
            id="message-input"
            value={input}
            maxLength={MAX_CHARS}
            rows={9}
            placeholder="Paste the message you want to investigate..."
            aria-invalid={Boolean(error)}
            aria-describedby="message-help"
            onChange={(e) => {
              setInput(e.target.value);
              setActiveSampleId(null);
            }}
            onKeyDown={handleKeyDown}
          />

          <p id="message-help" className="help">
            Press Ctrl/⌘ + Enter to analyze. The scan runs entirely on this device.
          </p>

          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}

          <div className="composer__actions">
            <button type="button" className="btn btn--primary" onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyzing…' : 'Analyze message'}
            </button>
            <button type="button" className="btn btn--ghost" onClick={handleClear} disabled={!input && !analysis}>
              Clear
            </button>
          </div>

          <div className="samples">
            <p className="samples__label">Load a sample</p>
            <div className="chip-row">
              {SAMPLE_MESSAGES.map((sample) => {
                const isActive = activeSampleId === sample.id;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    className={`chip${isActive ? ' is-active' : ''}`}
                    aria-pressed={isActive}
                    onClick={() => handleSample(sample)}
                  >
                    {sample.label}
                    <span>{sample.channel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="panel results" aria-live="polite">
          {isAnalyzing && (
            <div className="scanning">
              <div className="scanline" />
              <p>Checking keywords, links, payment demands and pressure tactics…</p>
            </div>
          )}

          {!isAnalyzing && !analysis && (
            <div className="empty">
              <div className="empty__ring" aria-hidden="true" />
              <h2 className="empty__title">Awaiting evidence</h2>
              <p>Your investigation report will appear here, with each red flag explained.</p>
            </div>
          )}

          {!isAnalyzing && analysis && analysis.status === 'ok' && (
            <p className={`reward${analysis.reward > 0 ? '' : ' is-repeat'}`}>
              {analysis.reward > 0
                ? `+${analysis.reward} XP earned for this investigation`
                : 'Already investigated. Repeat scans of the same message earn no XP.'}
            </p>
          )}

          {!isAnalyzing && analysis && <ScanReport analysis={analysis} />}
        </div>
      </div>

      <section className="history" aria-labelledby="history-heading">
        <div className="history__head">
          <h3 id="history-heading">Recent scans on this device</h3>
          {history.length > 0 && (
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setHistory([])}>
              Clear history
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="muted-note inline-note">
            No scans yet. Results are stored as scores only, never as message content.
          </p>
        ) : (
          <ul className="history__list">
            {history.map((entry) => (
              <li key={entry.id} className={`history__item tone-${entry.tone}`}>
                <span>
                  Score {entry.score} · {entry.flagCount} indicator{entry.flagCount === 1 ? '' : 's'} ·{' '}
                  {new Date(entry.at).toLocaleString()}
                </span>
                <span className="badge">{entry.level}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <details className="methodology">
        <summary>How the score is calculated</summary>
        <p>
          Each rule that matches adds its weight to the total. The total is capped at 100. Levels: 0–24 Low,
          25–49 Caution, 50–74 High, 75–100 Critical. A low score means few known patterns matched, not that the
          message is safe.
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col">Rule</th>
              <th scope="col">Category</th>
              <th scope="col">Weight</th>
            </tr>
          </thead>
          <tbody>
            {SCORING_RULES.map((rule) => (
              <tr key={rule.id}>
                <td>{rule.title}</td>
                <td>{rule.category}</td>
                <td>+{rule.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="inline-note">Levels in use: {RISK_LEVELS.map((l) => l.label).join(' · ')}.</p>
      </details>
    </section>
  );
}

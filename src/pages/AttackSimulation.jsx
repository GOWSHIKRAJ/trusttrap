import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateProgress } from '../utils/progress.js';
import { playTone, isMuted, setMuted } from '../utils/sound.js';

const TIMELINE = [
  'Suspicious page accessed',
  'Simulated credentials exposed',
  'Account activity flagged',
  'Fictional personal files marked at risk',
  'Security warning displayed',
];

const STAGE_NAMES = ['Fake page', 'Compromise', 'Incident', 'Explanation', 'Recovery'];

export default function AttackSimulation() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(1); // 1..5
  const [step, setStep] = useState(0);
  const [muted, setMutedState] = useState(isMuted());
  const countedRef = useRef(false);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  const replay = useCallback(() => {
    countedRef.current = false;
    setStep(0);
    setStage(1);
  }, []);

  // Stage 2 timeline: advances automatically, cleans up its timers on every change.
  useEffect(() => {
    if (stage !== 2) return undefined;
    if (step >= TIMELINE.length) {
      const id = setTimeout(() => setStage(3), 900);
      return () => clearTimeout(id);
    }
    playTone(180 + step * 60, 0.14, 'sawtooth', 0.025);
    const id = setTimeout(() => setStep((s) => s + 1), 1300);
    return () => clearTimeout(id);
  }, [stage, step]);

  // Count one completed simulation per full run, once.
  useEffect(() => {
    if (stage === 5 && !countedRef.current) {
      countedRef.current = true;
      updateProgress((p) => ({ ...p, simulations: p.simulations + 1 }));
    }
  }, [stage]);

  const startCompromise = () => {
    setStep(0);
    setStage(2);
  };

  const skipAnimation = () => {
    setStep(TIMELINE.length);
    setStage(3);
  };

  return (
    <div className="sim-page">
      <div className="sim-top container">
        <div>
          <p className="eyebrow sim-eyebrow">Educational simulation · Fictional</p>
          <h1 className="sim-title">Attack Simulation</h1>
        </div>
        <div className="sim-controls">
          <button type="button" className="btn btn-ghost btn-sm sim-btn" onClick={toggleMute} aria-pressed={muted}>
            {muted ? 'Sound off' : 'Sound on'}
          </button>
          {stage === 2 && (
            <button type="button" className="btn btn-ghost btn-sm sim-btn" onClick={skipAnimation}>Skip animation</button>
          )}
        </div>
      </div>

      <ol className="sim-progress container" aria-label="Simulation stages">
        {STAGE_NAMES.map((name, i) => (
          <li key={name} className={i + 1 === stage ? 'current' : i + 1 < stage ? 'done' : ''} aria-current={i + 1 === stage ? 'step' : undefined}>
            <span className="sim-progress-num">{i + 1}</span>
            <span>{name}</span>
          </li>
        ))}
      </ol>

      <div className="container sim-stage">
        {stage === 1 && (
          <section className="fake-browser" aria-labelledby="fake-title">
            <div className="browser-bar" aria-hidden="true">
              <span className="dots"><i /><i /><i /></span>
              <span className="address">zenith-trust-secure-check.example/verify</span>
            </div>
            <div className="warn-strip" role="note">
              <strong>Suspicious domain.</strong> A real bank would never ask you to verify here. This page is fictional.
            </div>
            <div className="fake-page">
              <div className="fake-brand">
                <span className="fake-logo" aria-hidden="true">Z</span>
                <span>Zenith Trust Bank <em>(fictional brand)</em></span>
              </div>
              <h2 id="fake-title">Verify your account</h2>
              <form className="fake-form" onSubmit={(e) => { e.preventDefault(); startCompromise(); }}>
                <label>
                  Username <em>(simulated)</em>
                  <input type="text" placeholder="Simulated username" autoComplete="off" />
                </label>
                <label>
                  Password <em>(simulated)</em>
                  <input type="password" placeholder="Simulated password" autoComplete="off" />
                </label>
                <p className="fake-note">Never enter real credentials on a page like this. Nothing you type here is stored or sent.</p>
                <button type="submit" className="btn btn-primary">Continue simulation</button>
              </form>
            </div>
          </section>
        )}

        {stage === 2 && (
          <section className="compromise" aria-live="polite" aria-labelledby="comp-title">
            <h2 id="comp-title">Simulated compromise in progress</h2>
            <div className="timeline-bar" role="progressbar" aria-valuemin={0} aria-valuemax={TIMELINE.length} aria-valuenow={Math.min(step, TIMELINE.length)}>
              <span style={{ width: `${(Math.min(step, TIMELINE.length) / TIMELINE.length) * 100}%` }} />
            </div>
            <ul className="timeline">
              {TIMELINE.map((t, i) => (
                <li key={t} className={i < step ? 'shown' : ''}>
                  <span className="tl-dot" aria-hidden="true" />
                  <span>{t}</span>
                  <span className="tl-status">{i < step ? 'Done' : i === step ? 'Running…' : 'Waiting'}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {stage === 3 && (
          <section className="incident" aria-labelledby="incident-title">
            <p className="incident-tag">Fictional incident report</p>
            <h2 id="incident-title">SIMULATED SECURITY BREACH</h2>
            <dl className="incident-grid">
              <div><dt>Account information</dt><dd>Exposed in simulation</dd></div>
              <div><dt>Personal files</dt><dd>At risk in simulation</dd></div>
              <div><dt>Device security</dt><dd>Threat detected in simulation</dd></div>
              <div><dt>Possible financial impact</dt><dd>Unauthorised payments</dd></div>
              <div><dt>Possible identity theft</dt><dd>Personal details misused</dd></div>
              <div><dt>Possible account takeover</dt><dd>Attacker signs in as you</dd></div>
            </dl>
            <p className="sim-disclaimer">This is a fictional educational simulation. No actual device or account has been accessed.</p>
            <button type="button" className="btn btn-primary" onClick={() => setStage(4)}>Understand what happened</button>
          </section>
        )}

        {stage === 4 && (
          <section className="explain" aria-labelledby="explain-title">
            <h2 id="explain-title">What happened, and why</h2>
            <div className="explain-grid">
              <article><h3>How phishing works</h3><p>Phishing imitates a trusted source to get you to act. The message is built to make you hurry.</p></article>
              <article><h3>Why the message was dangerous</h3><p>It threatened a suspension, set a deadline and asked you to verify through a link you did not expect.</p></article>
              <article><h3>How fake login pages steal details</h3><p>A copy of a real login screen records whatever you type and sends it to someone else.</p></article>
              <article><h3>How stolen details get misused</h3><p>Criminals use them to sign in, reset other passwords, make payments or pose as you.</p></article>
              <article><h3>Why urgency and fear work</h3><p>When you feel rushed or scared, you skip checks you would normally make. Pausing is the defence.</p></article>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => setStage(5)}>See recovery steps</button>
          </section>
        )}

        {stage === 5 && (
          <section className="recovery" aria-labelledby="recovery-title">
            <h2 id="recovery-title">Recovery guidance</h2>
            <p className="lead-sm">If this were real, here is what you would do. Follow official guidance and avoid improvised fixes.</p>
            <ol className="recovery-list">
              <li>Stop interacting with the suspicious page and close it.</li>
              <li>If you suspect malware, disconnect the affected device from networks where appropriate and run a trusted security scan.</li>
              <li>Change compromised passwords from a device you trust, starting with email and banking.</li>
              <li>Turn on multi-factor authentication for every important account.</li>
              <li>Contact your bank through the number on your card if financial credentials were exposed.</li>
              <li>Review recent account activity and sign out unknown sessions.</li>
              <li>Follow official recovery guidance from your device maker and account provider.</li>
              <li>Report financial cyber fraud at <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer">cybercrime.gov.in</a> or call the National Cyber Crime Helpline at <strong>1930</strong>.</li>
            </ol>
            <div className="recovery-actions">
              <Link to="/learn" className="btn btn-primary">Learn How to Prevent This</Link>
              <button type="button" className="btn btn-cobalt" onClick={() => navigate('/message')}>Try the Safe Path</button>
              <button type="button" className="btn btn-ghost" onClick={replay}>Replay simulation</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

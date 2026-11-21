import { Link } from 'react-router-dom';
import ThreatField from '../components/landing/ThreatField';
import ExampleBreakdown from '../components/landing/ExampleBreakdown';
import { SCORING_RULES } from '../utils/scamEngine';
import { SAMPLE_MESSAGES } from '../data/sampleMessages';
import '../styles/home.css';

const MODULES = [
  {
    code: '01',
    title: 'Scam Scanner',
    detail: 'Paste any suspicious message and receive an explainable risk report with next steps.',
    live: true,
    to: '/scanner',
  },
  {
    code: '02',
    title: 'Command Center',
    detail: 'Track your Guardian level, missions, badges and your threat timeline.',
    live: true,
    to: '/command',
  },
  {
    code: '03',
    title: 'Cyber Detective',
    detail: 'Choose the right response to realistic scam scenarios across three difficulty levels.',
    live: true,
    to: '/detective',
  },
  {
    code: '04',
    title: 'Escape the Scam',
    detail: 'A timed investigation in which you uncover a fake job offer and a dangerous payment demand.',
    live: true,
    to: '/escape',
  },
  {
    code: '05',
    title: 'Evidence Room',
    detail: 'Inspect each part of a fictional scam message and see how the red flags combine.',
    live: true,
    to: '/evidence',
  },
  {
    code: '06',
    title: 'Learning Hub',
    detail: 'Short interactive lessons on phishing, UPI safety, OTP protection and password hygiene.',
    live: true,
    to: '/learn',
  },
];

// Counts come from the app's own data, not from surveys.
const STATS = [
  { value: SCORING_RULES.length, label: 'Detection rules', note: 'Each with a published weight.' },
  { value: SAMPLE_MESSAGES.length, label: 'Fictional samples', note: 'Load any one with a single click.' },
  { value: 0, label: 'Messages sent to a server', note: 'Scanning runs entirely in your browser.' },
];

export default function LandingPage() {
  return (
    <div className="landing">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow">Think Before You Trust</p>
          <h1 id="hero-title">
            <span className="hero__line">The internet is full of traps.</span>
            <span className="hero__line hero__line--accent">Are you smart enough to spot them?</span>
          </h1>
          <p className="hero__sub">
            Investigate suspicious messages. Outsmart digital scammers. Protect your identity.
          </p>
          <div className="hero__actions">
            <Link to="/command" className="btn btn--primary btn--xl">
              Start investigating
            </Link>
            <a href="#experience" className="btn btn--ghost btn--xl">
              Explore the experience
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <ThreatField />
        </div>
      </section>

      <section className="section explain" id="experience" aria-labelledby="experience-title">
        <div>
          <p className="eyebrow">What TRUSTTRAP is</p>
          <h2 id="experience-title" className="section-title">
            An investigation room, not a lecture.
          </h2>
        </div>

        <div>
          <p className="explain__lead">
            TRUSTTRAP teaches scam awareness by letting you investigate it. Paste a message and the engine shows
            which signals it found, why each one matters, and what to do next. <strong>Every check runs on your
            device.</strong>
          </p>

          <ol className="modules">
            {MODULES.map((module) => (
              <li key={module.code} className="module">
                <span className="module__code">{module.code}</span>
                <div>
                  <h3>{module.to ? <Link to={module.to}>{module.title}</Link> : module.title}</h3>
                  <p>{module.detail}</p>
                </div>
                <span className={`module__status${module.live ? ' is-live' : ''}`}>
                  {module.live ? 'Live now' : 'Next build'}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="data-title">
        <p className="eyebrow">Under the hood</p>
        <h2 id="data-title" className="section-title">
          Transparent by design.
        </h2>
        <p className="data-note">Counts below come from the app's built-in data. They are not survey results.</p>

        <div className="stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat">
              <span className="stat__value">{stat.value}</span>
              <span className="stat__label">{stat.label}</span>
              <span className="stat__note">{stat.note}</span>
            </div>
          ))}
        </div>

        <ExampleBreakdown />
      </section>

      <section className="closing" aria-labelledby="closing-title">
        <h2 id="closing-title">Every trap starts with one message. Bring yours.</h2>
        <div className="hero__actions">
          <Link to="/command" className="btn btn--primary btn--xl">
            Start investigating
          </Link>
          <Link to="/scanner" className="btn btn--ghost btn--xl">
            Open the scanner
          </Link>
        </div>
      </section>
    </div>
  );
}

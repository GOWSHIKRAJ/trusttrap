import { Link, useNavigate } from 'react-router-dom';
import PhoneMockup, { LockScreenClock } from '../components/PhoneMockup.jsx';
import { MAIN_SCENARIO } from '../data/scenarios.js';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">Digital safety, hands-on</p>
          <h1 className="display">Would You <span className="marker">Trust</span> This Message?</h1>
          <p className="lead">
            One careless click can expose your digital life. Experience cyber threats, understand their
            consequences and learn how to stay protected.
          </p>
          <div className="cta-row">
            <Link to="/message" className="btn btn-primary btn-lg">Experience the Simulation</Link>
            <Link to="/learn" className="btn btn-ghost btn-lg">Explore Digital Safety</Link>
          </div>
          <p className="hero-note">Every scenario is fictional. Nothing is installed, stored or sent.</p>
        </div>

        <div className="hero-visual">
          <span className="float-chip chip-sun" aria-hidden="true">Phishing</span>
          <span className="float-chip chip-blush" aria-hidden="true">Pause. Verify.</span>
          <span className="float-ring" aria-hidden="true" />
          <PhoneMockup className="phone-hero" label="Smartphone showing a suspicious message notification">
            <div className="lock-screen">
              <LockScreenClock />
              <button
                type="button"
                className="notif-card"
                onClick={() => navigate('/message')}
                aria-label="Open the suspicious message from Unknown sender"
              >
                <span className="notif-app-icon" aria-hidden="true">✉</span>
                <span className="notif-body">
                  <span className="notif-head">
                    <strong>Messages</strong>
                    <span>now</span>
                  </span>
                  <span className="notif-sender">{MAIN_SCENARIO.sender}</span>
                  <span className="notif-text">{MAIN_SCENARIO.text}</span>
                </span>
              </button>
              <div className="app-row" aria-hidden="true">
                <span className="app-icon app-mail"><span>✉</span><b className="badge">1</b></span>
                <span className="app-icon app-bank">▣</span>
                <span className="app-icon app-maps">◎</span>
                <span className="app-icon app-camera">◉</span>
              </div>
            </div>
          </PhoneMockup>
        </div>
      </section>

      <section className="decisions container" aria-labelledby="decisions-title">
        <div className="section-head">
          <p className="eyebrow">Two possible decisions</p>
          <h2 id="decisions-title">What would you do next?</h2>
        </div>
        <div className="decision-grid">
          <article className="decision-card decision-unsafe">
            <span className="decision-num">01</span>
            <h3>Tap the link</h3>
            <p>Follow a fictional phishing journey and see how a fake login page, compromised accounts and recovery steps unfold.</p>
            <Link to="/simulation" className="text-link">See the consequences →</Link>
          </article>
          <article className="decision-card decision-safe">
            <span className="decision-num">02</span>
            <h3>Stop and analyze</h3>
            <p>Paste the message into the threat analyzer, see the warning signs explained and learn the safe action to take.</p>
            <Link to="/analyze" className="text-link">Analyze a message →</Link>
          </article>
        </div>
      </section>

      <section className="impact container" aria-labelledby="impact-title">
        <div className="impact-inner">
          <h2 id="impact-title">Scams work because they feel urgent.</h2>
          <p>
            Phishing does not need advanced hacking. It needs a message that feels urgent, a page that looks
            familiar and a moment of hurry. TrustTrap slows that moment down, so people can recognise the pattern
            before it costs them money, access or peace of mind.
          </p>
          <p className="impact-cta">
            If you have already lost money or been targeted, report it at <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer">cybercrime.gov.in</a> or call <strong>1930</strong>.
          </p>
        </div>
      </section>

      <section className="features container" aria-labelledby="features-title">
        <div className="section-head">
          <p className="eyebrow">Beyond the simulation</p>
          <h2 id="features-title">Learn, protect and track your progress</h2>
        </div>
        <div className="feature-list">
          <Link to="/learn" className="feature feature-learn">
            <span className="feature-tag">Learn</span>
            <h3>10 short lessons with quizzes</h3>
            <p>From phishing to financial scams, with real-world examples and practical prevention steps.</p>
          </Link>
          <Link to="/protect" className="feature feature-protect">
            <span className="feature-tag">Protect</span>
            <h3>Trusted security tools</h3>
            <p>Official resources for antivirus, password managers, MFA and lost-device protection.</p>
          </Link>
          <Link to="/journey" className="feature feature-journey">
            <span className="feature-tag">Journey</span>
            <h3>Track your progress</h3>
            <p>Earn badges as you learn. Your progress stays on this device only.</p>
          </Link>
        </div>
      </section>
    </>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneMockup from '../components/PhoneMockup.jsx';
import Modal from '../components/Modal.jsx';
import { MAIN_SCENARIO } from '../data/scenarios.js';
import { updateProgress } from '../utils/progress.js';
import { playTone } from '../utils/sound.js';

export default function MessageCentre() {
  const navigate = useNavigate();
  const [view, setView] = useState('inbox'); // 'inbox' | 'chat'
  const [confirmOpen, setConfirmOpen] = useState(false);

  const openChat = () => {
    playTone(520, 0.1, 'triangle');
    setView('chat');
  };

  const continueToSimulation = () => {
    updateProgress((p) => ({ ...p, unsafeDecisions: p.unsafeDecisions + 1 }));
    navigate('/simulation');
  };

  const goBackAndInspect = () => {
    setConfirmOpen(false);
    updateProgress((p) => ({ ...p, safeDecisions: p.safeDecisions + 1 }));
  };

  const analyzeFirst = () => {
    navigate('/analyze', { state: { text: MAIN_SCENARIO.text + ' ' + MAIN_SCENARIO.url } });
  };

  return (
    <div className="page-shell container">
      <header className="page-head">
        <p className="eyebrow">Experience</p>
        <h1>A message arrives. What do you do?</h1>
        <p className="lead">Tap the message and decide how to respond. Your choices shape what happens next.</p>
      </header>

      <div className="message-layout">
        <PhoneMockup className="phone-message" label="Messaging app simulation">
          <div className="app-screen">
            {view === 'inbox' ? (
              <div className="inbox">
                <header className="app-bar">
                  <h2>Messages</h2>
                </header>
                <ul className="thread-list">
                  <li>
                    <button type="button" className="thread-item" onClick={openChat} aria-label={`Open message from ${MAIN_SCENARIO.sender}`}>
                      <span className="avatar avatar-unknown" aria-hidden="true">?</span>
                      <span className="thread-body">
                        <span className="thread-top"><strong>{MAIN_SCENARIO.sender}</strong><time>{MAIN_SCENARIO.time}</time></span>
                        <span className="thread-preview">URGENT: Your bank account will be suspended today!</span>
                      </span>
                      <span className="dot" aria-hidden="true" />
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="chat">
                <header className="app-bar app-bar-chat">
                  <button type="button" className="back-btn" onClick={() => setView('inbox')} aria-label="Back to inbox">‹</button>
                  <span className="avatar avatar-unknown avatar-sm" aria-hidden="true">?</span>
                  <div>
                    <strong>{MAIN_SCENARIO.sender}</strong>
                    <span className="sub">Not in your contacts</span>
                  </div>
                </header>
                <div className="chat-body">
                  <p className="day-stamp">Today</p>
                  <div className="bubble incoming">
                    <p>{MAIN_SCENARIO.text.split('Verify your account immediately using the link below to avoid service interruption.')[0]}</p>
                    <p>Verify your account immediately using the link below to avoid service interruption.</p>
                    <button type="button" className="link-btn" onClick={() => setConfirmOpen(true)}>
                      {MAIN_SCENARIO.url}
                    </button>
                    <time>{MAIN_SCENARIO.time}</time>
                  </div>
                  <div className="analyze-cta">
                    <p>Not sure? Stop and check it first.</p>
                    <button type="button" className="btn btn-cobalt btn-sm" onClick={analyzeFirst}>
                      I don't trust this message. Analyze it first.
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </PhoneMockup>

        <aside className="message-aside" aria-label="About this scenario">
          <h2>What to notice</h2>
          <ul className="notice-list">
            <li><span>01</span> The sender is unknown and the tone is alarmist.</li>
            <li><span>02</span> A deadline ("today") pushes you to act quickly.</li>
            <li><span>03</span> The link asks you to verify an account you may never have opened.</li>
          </ul>
          <p className="aside-note">
            This message is fictional and imitates no real bank. The link opens only a fictional simulation inside this app.
          </p>
        </aside>
      </div>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Are you sure you want to open this suspicious link?" id="confirm-link">
        <p className="modal-text">
          The link is part of a fictional scenario. In real life, opening an unexpected link can expose your passwords and money.
        </p>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={continueToSimulation}>Continue to Simulation</button>
          <button type="button" className="btn btn-ghost" onClick={goBackAndInspect}>Go Back and Inspect the Message</button>
        </div>
      </Modal>
    </div>
  );
}

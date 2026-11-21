import { useCallback, useEffect, useReducer } from 'react';
import { useProgress } from '../context/ProgressContext';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  DIFFICULTIES,
  INITIAL_SESSION,
  buildQuestions,
  detectiveReducer,
  summarize,
} from '../utils/detective';
import DifficultyPicker from '../components/detective/DifficultyPicker';
import QuestionView from '../components/detective/QuestionView';
import RoundSummary from '../components/detective/RoundSummary';
import '../styles/detective.css';

export default function DetectivePage() {
  const [session, dispatch] = useReducer(detectiveReducer, INITIAL_SESSION);
  const { recordAnswer } = useProgress();
  const [best, setBest] = useLocalStorage('trusttrap.detectiveBest', {});

  // Stable handler, so the countdown timer does not restart on unrelated renders.
  const handleAnswer = useCallback((choiceId) => dispatch({ type: 'answer', choiceId }), []);

  // Each new answer is written to the shared profile exactly once.
  useEffect(() => {
    if (session.answers.length === 0) return;
    const last = session.answers[session.answers.length - 1];
    recordAnswer(last.correct, last.xp);
    // Depends on the count only, so a new answer triggers exactly one update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.answers.length]);

  // Save the best round per difficulty when a round finishes.
  useEffect(() => {
    if (session.phase !== 'summary') return;
    const { correct } = summarize(session.answers);
    const current = best[session.difficulty];
    if (!current || correct > current.correct) {
      setBest({ ...best, [session.difficulty]: { correct, total: session.answers.length } });
    }
    // Runs once when the round reaches its summary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.phase]);

  const config = session.difficulty ? DIFFICULTIES[session.difficulty] : null;
  const tally = summarize(session.answers);
  const question = session.questions[session.index];

  function startRound(difficulty) {
    dispatch({ type: 'start', difficulty, questions: buildQuestions(difficulty) });
  }

  return (
    <section aria-labelledby="detective-title">
      <header className="page-header">
        <p className="eyebrow">Module 03 · Cyber Detective</p>
        <h1 id="detective-title">Read the message. Make the call.</h1>
        <p className="lede">
          Six realistic scenarios, three difficulty levels. Each decision earns XP and feeds your accuracy in the
          Command Center.
        </p>
      </header>

      {session.phase === 'setup' && <DifficultyPicker best={best} onStart={startRound} />}

      {session.phase === 'playing' && question && config && (
        <QuestionView
          key={session.index}
          question={question}
          index={session.index}
          total={session.questions.length}
          config={config}
          answer={session.answers[session.index] ?? null}
          tally={tally}
          onAnswer={handleAnswer}
          onNext={() => dispatch({ type: 'next' })}
        />
      )}

      {session.phase === 'summary' && config && (
        <RoundSummary
          questions={session.questions}
          answers={session.answers}
          config={config}
          record={best[config.key]}
          onReplay={() => startRound(session.difficulty)}
          onChangeDifficulty={() => dispatch({ type: 'restart' })}
        />
      )}
    </section>
  );
}

import { useState } from 'react';

/** Single-question quiz with immediate, explained feedback. */
export default function Quiz({ quiz, onAnswered }) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;
  const correct = selected === quiz.answer;

  const choose = (index) => {
    if (answered) return;
    setSelected(index);
    onAnswered?.(index === quiz.answer ? 100 : 0);
  };

  return (
    <section className="quiz" aria-labelledby="quiz-question">
      <h3 id="quiz-question" className="quiz-question">{quiz.question}</h3>
      <div className="quiz-options" role="radiogroup" aria-labelledby="quiz-question">
        {quiz.options.map((opt, i) => {
          let state = '';
          if (answered && i === quiz.answer) state = 'correct';
          else if (answered && i === selected) state = 'wrong';
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={selected === i}
              className={`quiz-option ${state}`}
              onClick={() => choose(i)}
              disabled={answered && state === ''}
            >
              <span className="quiz-letter" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`quiz-feedback ${correct ? 'good' : 'bad'}`} role="status">
          <strong>{correct ? 'Correct.' : 'Not quite.'}</strong> {quiz.explanation}
        </div>
      )}
    </section>
  );
}

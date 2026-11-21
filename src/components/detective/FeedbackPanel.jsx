export default function FeedbackPanel({ answer, chosen, correctChoice, scenario, isLast, onNext }) {
  const verdict = answer.timedOut
    ? 'Time ran out'
    : answer.correct
      ? 'Correct call'
      : 'Not the safest move';

  const note = chosen ? chosen.feedback : 'No decision was made in time. This counts as incorrect.';

  return (
    <div className={`feedback ${answer.correct ? 'is-correct' : 'is-wrong'}`} role="status">
      <p className="feedback__verdict">{verdict}</p>
      <p className="feedback__note">{note}</p>

      {!answer.correct && correctChoice && (
        <p className="feedback__best">
          <span>Best move:</span> {correctChoice.text}
        </p>
      )}

      <p className="feedback__xp">{answer.correct ? `+${answer.xp} XP` : 'No XP this time'}</p>

      <div className="feedback__why">
        <p className="panel__title">Red flags in this message</p>
        <ul className="flag-check">
          {scenario.redFlags.map((flag) => (
            <li key={flag}>{flag}</li>
          ))}
        </ul>
        <p className="feedback__explain">{scenario.explanation}</p>
      </div>

      <button type="button" className="btn btn--primary feedback__next" onClick={onNext}>
        {isLast ? 'See results' : 'Next scenario'}
      </button>
    </div>
  );
}

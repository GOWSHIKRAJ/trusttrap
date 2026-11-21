const LETTERS = 'ABCD';

function PaymentCard({ screen }) {
  return (
    <dl className="pay-card" aria-label="Payment request">
      <div>
        <dt>Payee</dt>
        <dd>{screen.payee}</dd>
      </div>
      <div>
        <dt>UPI ID</dt>
        <dd>{screen.upi}</dd>
      </div>
      <div>
        <dt>Amount</dt>
        <dd>{screen.amount}</dd>
      </div>
      <div>
        <dt>Note</dt>
        <dd>{screen.note}</dd>
      </div>
      <div>
        <dt>Timer</dt>
        <dd>{screen.deadline}</dd>
      </div>
    </dl>
  );
}

export default function ChoiceStage({ stage, state, onChoose }) {
  const locked = state.phase !== 'stage';

  return (
    <div className="choice-stage">
      {stage.screen ? <PaymentCard screen={stage.screen} /> : <p className="scene-text">{stage.context}</p>}

      <ul className="choices">
        {stage.options.map((option, i) => {
          const eliminated = state.eliminated.includes(option.id);
          const correct = locked && option.correct;
          const classes = ['choice'];
          if (eliminated) classes.push('is-wrong');
          if (correct) classes.push('is-correct');

          return (
            <li key={option.id}>
              <button
                type="button"
                className={classes.join(' ')}
                disabled={locked || eliminated}
                onClick={() => onChoose(option.id)}
              >
                <span className="choice__letter">{LETTERS[i]}</span>
                <span>{option.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

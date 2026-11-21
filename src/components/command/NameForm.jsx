import { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';

export default function NameForm({ onDone }) {
  const { progress, setDisplayName } = useProgress();
  const [value, setValue] = useState(progress.displayName);
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const result = setDisplayName(value);
    if (result) {
      setError(result);
      return;
    }
    setError('');
    onDone?.();
  }

  return (
    <form className="name-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="guardian-name">Guardian name</label>
      <div className="name-form__row">
        <input
          id="guardian-name"
          type="text"
          value={value}
          maxLength={30}
          autoComplete="nickname"
          placeholder="e.g. Asha"
          aria-invalid={Boolean(error)}
          aria-describedby="guardian-name-help"
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError('');
          }}
        />
        <button type="submit" className="btn btn--primary">
          Save name
        </button>
      </div>
      {error ? (
        <p role="alert" className="form-error" id="guardian-name-help">
          {error}
        </p>
      ) : (
        <p id="guardian-name-help" className="help">
          Stored only on this device. Use 2 to 20 letters, numbers, spaces, hyphens or underscores.
        </p>
      )}
    </form>
  );
}

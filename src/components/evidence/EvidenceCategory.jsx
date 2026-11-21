export default function EvidenceCategory({ index, category, progress, onExamine }) {
  const examined = category.items.filter((item) => progress.evidenceItems.includes(item.id)).length;
  const complete = progress.evidenceCategories.includes(category.id);

  return (
    <article className={`panel evidence-cat${complete ? ' is-complete' : ''}`} aria-labelledby={`cat-${category.id}`}>
      <header className="evidence-cat__head">
        <span className="evidence-cat__index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="evidence-cat__title">
          <h3 id={`cat-${category.id}`}>{category.label}</h3>
          <p className="muted-note">{category.question}</p>
        </div>
        <span className="evidence-cat__count">{complete ? 'Examined' : `${examined} / ${category.items.length}`}</span>
      </header>

      <ul className="evidence-items">
        {category.items.map((item) => {
          const revealed = progress.evidenceItems.includes(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`evidence-item${revealed ? ' is-revealed' : ''}`}
                aria-expanded={revealed}
                onClick={() => onExamine(item, category)}
              >
                <span className="evidence-item__label">{item.label}</span>
                <span className="evidence-item__action">{revealed ? 'Examined' : 'Examine'}</span>
              </button>
              {revealed && <p className="evidence-item__finding">{item.finding}</p>}
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default function FlagList({ flags }) {
  return (
    <section aria-labelledby="flags-heading">
      <h3 id="flags-heading">Red flags detected</h3>
      <ul className="flag-list">
        {flags.map((flag, index) => (
          <li key={flag.id} className="flag" style={{ '--delay': `${index * 80}ms` }}>
            <div className="flag__head">
              <span>{flag.category}</span>
              <span>+{flag.weight}</span>
            </div>
            <h4>{flag.title}</h4>
            <p className="flag__evidence">
              Matched: <code>{flag.evidence}</code>
            </p>
            <p>{flag.explanation}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

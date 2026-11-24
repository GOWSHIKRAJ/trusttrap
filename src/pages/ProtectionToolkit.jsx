import { Link } from 'react-router-dom';
import { CATEGORIES, TOOLS } from '../data/tools.js';

export default function ProtectionToolkit() {
  return (
    <div className="page-shell container">
      <header className="page-head">
        <p className="eyebrow">Protect</p>
        <h1>Digital Protection Toolkit</h1>
        <p className="lead">
          Curated tools and official resources to turn awareness into action. TrustTrap guides you to the official sites;
          it does not install or run any security software itself.
        </p>
      </header>

      <nav className="cat-jump" aria-label="Tool categories">
        {CATEGORIES.map((c) => <a key={c.id} href={`#${c.id}`} className={`chip tone-${c.color}`}>{c.name}</a>)}
      </nav>

      {CATEGORIES.map((cat, ci) => {
        const tools = TOOLS.filter((t) => t.category === cat.id);
        return (
          <section key={cat.id} id={cat.id} className={`tool-section tone-${cat.color} layout-${ci % 3}`} aria-labelledby={`${cat.id}-title`}>
            <div className="tool-section-head">
              <span className="cat-index">{String(ci + 1).padStart(2, '0')}</span>
              <div>
                <h2 id={`${cat.id}-title`}>{cat.name}</h2>
                <p>{cat.blurb}</p>
              </div>
            </div>
            <ul className="tool-grid">
              {tools.map((tool) => (
                <li key={tool.id}>
                  <Link to={`/protect/${tool.id}`} className="tool-card">
                    <span className="tool-icon" aria-hidden="true">{tool.icon}</span>
                    <span className="tool-name">{tool.name}</span>
                    <span className="tool-desc">{tool.description}</span>
                    <span className="tool-more">View details →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <aside className="reminder" aria-label="Important">
        <h2>Before you install anything</h2>
        <p>Download only from the official site or the official app store. Check the address yourself rather than tapping a link in a message. Verify pricing and device support on the vendor's page.</p>
      </aside>
    </div>
  );
}

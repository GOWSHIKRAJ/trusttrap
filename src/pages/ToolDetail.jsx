import { Link, useParams } from 'react-router-dom';
import NotFound from './NotFound.jsx';
import { getTool, getCategory } from '../data/tools.js';

function List({ items }) {
  return <ul className="check-list">{items.map((i) => <li key={i}>{i}</li>)}</ul>;
}

export default function ToolDetail() {
  const { toolId } = useParams();
  const tool = getTool(toolId);
  if (!tool) return <NotFound />;
  const category = getCategory(tool.category);

  return (
    <div className={`page-shell container tool-detail tone-${category.color}`}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/protect">← Protection toolkit</Link>
      </nav>

      <header className="tool-hero">
        <span className="tool-icon tool-icon-lg" aria-hidden="true">{tool.icon}</span>
        <div>
          <p className="eyebrow">{category.name}</p>
          <h1>{tool.name}</h1>
          <p className="lead">{tool.description}</p>
          <div className="cta-row">
            <a className="btn btn-primary" href={tool.website} target="_blank" rel="noopener noreferrer">Official website ↗</a>
            {tool.download && tool.download !== tool.website && (
              <a className="btn btn-ghost" href={tool.download} target="_blank" rel="noopener noreferrer">Official download ↗</a>
            )}
          </div>
        </div>
      </header>

      <div className="detail-grid">
        <section aria-labelledby="purpose-title">
          <h2 id="purpose-title" className="panel-title">Main purpose</h2>
          <p>{tool.purpose}</p>
        </section>
        <section aria-labelledby="platforms-title">
          <h2 id="platforms-title" className="panel-title">Supported platforms</h2>
          <p>{tool.platforms.join(' · ')}</p>
          <p className="hint">Availability and features vary by device and plan. Check the official page.</p>
        </section>
        <section aria-labelledby="benefits-title">
          <h2 id="benefits-title" className="panel-title">Benefits</h2>
          <List items={tool.benefits} />
        </section>
        <section aria-labelledby="limits-title">
          <h2 id="limits-title" className="panel-title">Limitations</h2>
          <List items={tool.limitations} />
        </section>
        <section aria-labelledby="install-title" className="wide">
          <h2 id="install-title" className="panel-title">Installation guide</h2>
          <ol className="steps">{tool.install.map((s) => <li key={s}>{s}</li>)}</ol>
        </section>
        <section aria-labelledby="usage-title">
          <h2 id="usage-title" className="panel-title">Usage tips</h2>
          <List items={tool.usage} />
        </section>
        <section aria-labelledby="safety-title" className="safety">
          <h2 id="safety-title" className="panel-title">Safety tips</h2>
          <List items={tool.safety} />
        </section>
      </div>

      <footer className="lesson-foot">
        <Link to="/protect" className="btn btn-ghost">Back to toolkit</Link>
        <Link to="/learn" className="btn btn-cobalt">Learn the basics</Link>
      </footer>
    </div>
  );
}

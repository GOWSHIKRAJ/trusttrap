import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-shell container not-found">
      <p className="eyebrow">404</p>
      <h1>This page is not part of the simulation.</h1>
      <p className="lead">The link may be broken or the page may have moved.</p>
      <div className="cta-row">
        <Link to="/" className="btn btn-primary">Back to home</Link>
        <Link to="/learn" className="btn btn-ghost">Go to learning centre</Link>
      </div>
    </div>
  );
}

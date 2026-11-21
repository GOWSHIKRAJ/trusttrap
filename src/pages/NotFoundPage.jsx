import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="page-header">
      <p className="eyebrow">Error 404</p>
      <h1>This trap leads nowhere.</h1>
      <p className="lede">The page you requested does not exist.</p>
      <Link to="/scanner" className="btn btn--primary not-found-link">
        Back to the Scanner
      </Link>
    </section>
  );
}

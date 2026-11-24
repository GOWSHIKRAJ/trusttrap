import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">TrustTrap 2.0</p>
          <p className="footer-tagline">Experience the threat. Learn to defend.</p>
          <p className="footer-note">
            TrustTrap is an educational project. Every attack shown on this site is fictional, and no
            real device, account or data is accessed.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="footer-heading">Explore</p>
          <ul>
            <li><Link to="/message">Message experience</Link></li>
            <li><Link to="/analyze">Threat analyzer</Link></li>
            <li><Link to="/learn">Learning centre</Link></li>
            <li><Link to="/protect">Protection toolkit</Link></li>
          </ul>
        </nav>
        <div>
          <p className="footer-heading">Report cyber fraud in India</p>
          <ul>
            <li><a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer">cybercrime.gov.in</a></li>
            <li>National Cyber Crime Helpline: <strong>1930</strong></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>Built with React, Vite and LocalStorage. No backend. No tracking.</span>
      </div>
    </footer>
  );
}

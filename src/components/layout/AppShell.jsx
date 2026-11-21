import { NavLink, Outlet } from 'react-router-dom';
import { NAV_ITEMS } from '../../data/navigation';
import { useProgress } from '../../context/ProgressContext';
import '../../styles/command.css';

export default function AppShell() {
  const { progress, level } = useProgress();

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="TRUSTTRAP home">
          <span className="brand__mark" aria-hidden="true" />
          <span>TRUSTTRAP</span>
        </NavLink>

        <div className="topbar__right">
          <nav aria-label="Primary">
            <ul className="topnav">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                    <span className="topnav__code" aria-hidden="true">{item.code}</span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {progress.displayName && (
            <NavLink to="/profile" className="guardian-chip" title="Open your Guardian profile">
              {progress.displayName} · L{level.number}
            </NavLink>
          )}
        </div>
      </header>

      <main id="main" className="page" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="footer">TRUSTTRAP · Think Before You Trust · Educational use only</footer>
    </div>
  );
}

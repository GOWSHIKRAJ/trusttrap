import { Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import LandingPage from './pages/LandingPage';
import CommandCenterPage from './pages/CommandCenterPage';
import ScannerPage from './pages/ScannerPage';
import DetectivePage from './pages/DetectivePage';
import EscapePage from './pages/EscapePage';
import EvidencePage from './pages/EvidencePage';
import LearningPage from './pages/LearningPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<LandingPage />} />
        <Route path="command" element={<CommandCenterPage />} />
        <Route path="scanner" element={<ScannerPage />} />
        <Route path="detective" element={<DetectivePage />} />
        <Route path="escape" element={<EscapePage />} />
        <Route path="evidence" element={<EvidencePage />} />
        <Route path="learn" element={<LearningPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

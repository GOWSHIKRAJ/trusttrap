import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import MessageCentre from './pages/MessageCentre.jsx';
import AttackSimulation from './pages/AttackSimulation.jsx';
import ThreatAnalyzer from './pages/ThreatAnalyzer.jsx';
import LearningCentre from './pages/LearningCentre.jsx';
import LessonDetail from './pages/LessonDetail.jsx';
import ProtectionToolkit from './pages/ProtectionToolkit.jsx';
import ToolDetail from './pages/ToolDetail.jsx';
import MyJourney from './pages/MyJourney.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main" tabIndex={-1} className="page-enter" key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/message" element={<MessageCentre />} />
          <Route path="/simulation" element={<AttackSimulation />} />
          <Route path="/analyze" element={<ThreatAnalyzer />} />
          <Route path="/learn" element={<LearningCentre />} />
          <Route path="/learn/:lessonId" element={<LessonDetail />} />
          <Route path="/protect" element={<ProtectionToolkit />} />
          <Route path="/protect/:toolId" element={<ToolDetail />} />
          <Route path="/journey" element={<MyJourney />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

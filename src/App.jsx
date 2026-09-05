import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Preloader from './components/Preloader';
import { Analytics } from "@vercel/analytics/react"
import './styles/main.css';
import './styles/portfolio.css';

const Download = lazy(() => import('./pages/Download'));
const AiDetection = lazy(() => import('./pages/AiDetection'));
const Monitoring = lazy(() => import('./pages/Monitoring'));

function LegacyPage({ children, title }) {
  useEffect(() => {
    document.title = `${title} — Yeshaswi Singh`;
    window.scrollTo(0, 0);
    return () => { document.title = 'Yeshaswi Singh — Developer & Security Researcher'; };
  }, [title]);
  return <div className="legacy-route" id="main-content" tabIndex={-1}>{children}</div>;
}

function App() {
  return (
    <Router>
      <Analytics />
      <Preloader>
      <Navbar />
      <Suspense fallback={<main id="main-content" className="route-loading" aria-live="polite">Opening project…</main>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/downloads" element={<LegacyPage title="Downloads"><Download /></LegacyPage>} />
        <Route path="/ai-detection" element={<LegacyPage title="AI Detector"><AiDetection /></LegacyPage>} />
        <Route path="/monitoring" element={<LegacyPage title="Monitoring"><Monitoring /></LegacyPage>} />
        <Route path="*" element={<main id="main-content" className="not-found"><p className="eyebrow">404 / PAGE NOT FOUND</p><h1>A little off course.</h1><p>Let’s get you back to the work.</p><a href="/" className="btn btn-primary">Back to the portfolio ↗</a></main>} />
      </Routes>
      </Suspense>
      <Footer />
      </Preloader>
    </Router>
  );
}

export default App;

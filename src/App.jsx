import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import Footer from './components/Footer';
import Home from './pages/Home';
import Download from './pages/Download';
import AiDetection from './pages/AiDetection';
import Monitoring from './pages/Monitoring';
import { Analytics } from "@vercel/analytics/react"
import './styles/main.css';

function App() {
  return (
    <Router>
      <Analytics />
      <Preloader />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/downloads" element={<Download />} />
        <Route path="/ai-detection" element={<AiDetection />} />
        <Route path="/monitoring" element={<Monitoring />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import Footer from './components/Footer';
import Home from './pages/Home';
import Download from './pages/Download';
import './styles/main.css';

function App() {
  return (
    <Router>
      <Preloader />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/downloads" element={<Download />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

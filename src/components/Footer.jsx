import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
export default function Footer() {
  const { pathname } = useLocation();
  return <footer className="site-footer"><div className="container">
    <div className="footer-main"><Link to="/" className="footer-brand">yeshaswi<span className="mint">.</span></Link><p>Thoughtful code. Lasting impact.</p><div className="footer-links"><Link to="/downloads">Downloads <ArrowUpRight size={13} /></Link><Link to="/ai-detection">AI Detector <ArrowUpRight size={13} /></Link><a href={pathname === '/' ? '#certifications' : '/#certifications'}>Credentials <ArrowUpRight size={13} /></a></div></div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} Yeshaswi Singh</p><span>DESIGNED WITH INTENT. BUILT WITH CARE.</span><a href={pathname === '/' ? '#home' : '#'} onClick={pathname !== '/' ? () => window.scrollTo({ top: 0, behavior: 'smooth' }) : undefined}>Back to top <ArrowUp size={15} /></a></div>
  </div></footer>;
}


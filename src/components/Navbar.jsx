import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const links = [['Work', 'projects'], ['About', 'about'], ['Expertise', 'skills'], ['Experience', 'experience']];
export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const home = pathname === '/';
  useEffect(() => {
    if (!home) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-20% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [home]);
  useEffect(() => {
    if (!menuOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector('a')?.focus();
    const keydown = event => {
      if (event.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus(); }
      if (event.key === 'Tab') {
        const items = [...menuRef.current.querySelectorAll('a'), toggleRef.current];
        const first = items[0]; const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const resized = () => { if (window.innerWidth > 980) setMenuOpen(false); };
    document.addEventListener('keydown', keydown); window.addEventListener('resize', resized);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', keydown); window.removeEventListener('resize', resized); };
  }, [menuOpen]);
  const close = () => setMenuOpen(false);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <nav className="container nav-container" aria-label="Main navigation">
        <Link to="/" className="nav-logo" aria-label="Yeshaswi Singh home" onClick={close}><span className="brand-monogram">y<span>s</span><i /></span><span>yeshaswi<span className="mint">.</span></span></Link>
        <div ref={menuRef} id="primary-navigation" className={`nav-menu ${menuOpen ? 'is-open' : ''}`}>
          {links.map(([label, id]) => <a key={id} className={`nav-link ${home && active === id ? 'is-active' : ''}`} href={home ? `#${id}` : `/#${id}`} onClick={close} aria-current={home && active === id ? 'location' : undefined}>{label}</a>)}
          <a className="nav-link mobile-link" href={home ? '#certifications' : '/#certifications'} onClick={close}>Credentials</a>
          <a className="nav-link mobile-link" href={home ? '#contact' : '/#contact'} onClick={close}>Contact</a>
        </div>
        <a className="nav-contact" href={home ? '#contact' : '/#contact'}>Let’s talk <ArrowUpRight size={16} /></a>
        <button className="menu-toggle" ref={toggleRef} aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>
      </nav>
    </header>
  </>;
}


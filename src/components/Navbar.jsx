import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    // Determine if we're on home page for hash links
    const isHomePage = location.pathname === '/';

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-logo">Yeshaswi.</Link>

                <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
                    <li className="nav-item">
                        <a href={isHomePage ? "#about" : "/#about"} className="nav-link" onClick={closeMenu}>About</a>
                    </li>
                    <li className="nav-item">
                        <a href={isHomePage ? "#skills" : "/#skills"} className="nav-link" onClick={closeMenu}>Skills</a>
                    </li>
                    <li className="nav-item">
                        <a href={isHomePage ? "#experience" : "/#experience"} className="nav-link" onClick={closeMenu}>Experience</a>
                    </li>
                    <li className="nav-item">
                        <a href={isHomePage ? "#projects" : "/#projects"} className="nav-link" onClick={closeMenu}>Projects</a>
                    </li>
                    <li className="nav-item">
                        <a href={isHomePage ? "#certifications" : "/#certifications"} className="nav-link" onClick={closeMenu}>Certifications</a>
                    </li>
                    <li className="nav-item">
                        <Link to="/downloads" className={`nav-link ${location.pathname === '/downloads' ? 'active' : ''}`} onClick={closeMenu}>Downloads</Link>
                    </li>
                    <li className="nav-item">
                        <a href={isHomePage ? "#contact" : "/#contact"} className="nav-link" onClick={closeMenu}>Contact</a>
                    </li>
                </ul>

                <div className="nav-actions">
                    <a href="https://github.com/yeshaswi3060" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="GitHub">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                    </a>
                    <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                        <span className="bar" style={menuOpen ? { transform: 'rotate(45deg) translate(5px, 6px)' } : {}}></span>
                        <span className="bar" style={menuOpen ? { transform: 'rotate(-45deg) translate(5px, -6px)' } : {}}></span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

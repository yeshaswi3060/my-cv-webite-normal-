import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/download.css';

const Download = () => {
    const particlesRef = useRef(null);

    useEffect(() => {
        // Create particles
        const createParticles = () => {
            const container = particlesRef.current;
            if (!container) return;

            container.innerHTML = '';
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation-delay: ${Math.random() * 5}s;
          animation-duration: ${5 + Math.random() * 5}s;
          width: ${2 + Math.random() * 3}px;
          height: ${2 + Math.random() * 3}px;
        `;
                container.appendChild(particle);
            }
        };
        createParticles();

        // Scroll Reveal Animation
        const scrollRevealElements = document.querySelectorAll(
            '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-up, .scroll-reveal-scale'
        );

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        scrollRevealElements.forEach(el => {
            revealObserver.observe(el);
        });

        // Smooth scroll for scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                document.querySelector('.features-section')?.scrollIntoView({ behavior: 'smooth' });
            });
        }

        return () => {
            revealObserver.disconnect();
        };
    }, []);

    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8V4H8" />
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v2" />
                    <path d="M9 13v2" />
                </svg>
            ),
            title: 'AI-Powered Assistance',
            desc: 'Get intelligent answers and suggestions powered by advanced language models',
            direction: 'left'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
            ),
            title: 'Voice Recognition',
            desc: 'Real-time speech-to-text captures conversations and audio with precision',
            direction: 'right'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            ),
            title: 'Smart Screen Reading',
            desc: 'Automatically detect and understand any text visible on your screen',
            direction: 'left'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            ),
            title: 'Context Awareness',
            desc: 'Understands your current task and provides relevant, actionable help',
            direction: 'right'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ),
            title: 'Multiple AI Modes',
            desc: 'Switch between different AI personas for coding, writing, research & more',
            direction: 'left'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
            ),
            title: 'Complete Invisibility',
            desc: 'Hidden from screen sharing, recordings, and screenshots — always private',
            direction: 'right'
        },
    ];

    const useCases = [
        {
            title: 'Work & Meetings',
            desc: 'Get real-time suggestions during calls, emails, and presentations',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
            )
        },
        {
            title: 'Learning & Research',
            desc: 'Instant explanations and answers while studying any topic',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
            )
        },
        {
            title: 'Coding & Development',
            desc: 'Debug, explain code, and get suggestions without leaving your IDE',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
            )
        },
        {
            title: 'Writing & Content',
            desc: 'Improve your writing with real-time grammar and style suggestions',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
            )
        },
        {
            title: 'Interviews & Calls',
            desc: 'Confidential assistance during important conversations',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            )
        },
        {
            title: 'Browsing & Research',
            desc: 'Summarize pages, compare options, and get quick insights',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            )
        },
    ];

    return (
        <main className="gogly-page">
            {/* Hero/Intro Section */}
            <section className="gogly-hero">
                <div className="hero-gradient-bg"></div>
                <div className="hero-grid-overlay"></div>
                <div ref={particlesRef} className="particles-container"></div>

                <div className="hero-content-wrapper">
                    <div className="gogly-logo scroll-reveal">
                        <span className="logo-accent">—</span>
                        <span className="logo-text">GOGLY</span>
                        <span className="logo-accent">—</span>
                    </div>

                    <h1 className="gogly-tagline scroll-reveal">Your Hidden AI Assistant</h1>

                    <p className="gogly-description scroll-reveal">
                        An invisible AI companion that lives on your screen.<br />
                        Always ready. Never visible. Helps you with anything.
                    </p>

                    <p className="creator-credit scroll-reveal">
                        <span className="credit-line"></span>
                        Created by Yeshaswi
                        <span className="credit-line"></span>
                    </p>

                    <div className="scroll-indicator scroll-reveal">
                        <span>Discover</span>
                        <div className="scroll-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M19 12l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="usecases-section section">
                <div className="container">
                    <div className="section-header scroll-reveal">
                        <span className="section-label">Use It Anywhere</span>
                        <h2 className="section-title">Built for Everything</h2>
                        <div className="section-line"></div>
                    </div>

                    <div className="usecases-grid">
                        {useCases.map((useCase, index) => (
                            <div
                                key={index}
                                className="usecase-card scroll-reveal-up"
                                style={{ '--delay': `${index * 0.08}s` }}
                            >
                                <div className="usecase-icon">{useCase.icon}</div>
                                <h3>{useCase.title}</h3>
                                <p>{useCase.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section section">
                <div className="container">
                    <div className="section-header scroll-reveal">
                        <span className="section-label">Capabilities</span>
                        <h2 className="section-title">Powerful Features</h2>
                        <div className="section-line"></div>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`feature-card scroll-reveal-${feature.direction}`}
                                style={{ '--delay': `${index * 0.1}s` }}
                            >
                                <div className="feature-number">{String(index + 1).padStart(2, '0')}</div>
                                <div className="feature-icon">{feature.icon}</div>
                                <div className="feature-content">
                                    <h3>{feature.title}</h3>
                                    <p>{feature.desc}</p>
                                </div>
                                <div className="feature-line"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="comparison-section section">
                <div className="container">
                    <div className="section-header scroll-reveal">
                        <span className="section-label">Privacy First</span>
                        <h2 className="section-title">Completely Invisible</h2>
                        <div className="section-line"></div>
                    </div>

                    <div className="comparison-container">
                        <div className="comparison-card scroll-reveal-left">
                            <div className="comparison-header">
                                <span className="view-label user-label">Your View</span>
                                <h3>Full AI Access</h3>
                            </div>
                            <div className="comparison-preview">
                                <div className="mock-screen user-screen">
                                    <div className="mock-notch">
                                        <div className="notch-dot"></div>
                                        <div className="notch-text">AI Assistant Ready</div>
                                    </div>
                                    <div className="mock-window">
                                        <div className="window-bar">
                                            <span></span><span></span><span></span>
                                        </div>
                                        <div className="window-content">
                                            <div className="content-line"></div>
                                            <div className="content-line short"></div>
                                            <div className="content-line"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="comparison-features">
                                <div className="cf-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                    AI overlay visible to you
                                </div>
                                <div className="cf-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                    Real-time responses
                                </div>
                                <div className="cf-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                    Context-aware assistance
                                </div>
                            </div>
                        </div>

                        <div className="comparison-divider scroll-reveal-scale">
                            <div className="divider-line-v"></div>
                            <div className="divider-badge">VS</div>
                            <div className="divider-line-v"></div>
                        </div>

                        <div className="comparison-card scroll-reveal-right">
                            <div className="comparison-header">
                                <span className="view-label interviewer-label">Everyone Else</span>
                                <h3>Nothing Visible</h3>
                            </div>
                            <div className="comparison-preview">
                                <div className="mock-screen interviewer-screen">
                                    <div className="mock-window">
                                        <div className="window-bar">
                                            <span></span><span></span><span></span>
                                        </div>
                                        <div className="window-content">
                                            <div className="content-line"></div>
                                            <div className="content-line short"></div>
                                            <div className="content-line"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="comparison-features">
                                <div className="cf-item locked">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                    Hidden from screen share
                                </div>
                                <div className="cf-item locked">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                    Invisible in recordings
                                </div>
                                <div className="cf-item locked">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                    Undetectable by others
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Download Section */}
            <section className="download-section section">
                <div className="container">
                    <div className="download-cta-wrapper scroll-reveal-scale">
                        <div className="cta-border-glow"></div>

                        <div className="cta-content">
                            <span className="cta-label">Get Started</span>
                            <h2 className="cta-title">Ready for Your Hidden AI?</h2>
                            <p className="cta-subtitle">Download GOGLY and experience invisible AI assistance</p>
                            <div className="cta-buttons">
                                <a
                                    href="https://github.com/yeshaswi3060/gogly/releases/latest/download/gogly.Setup.1.0.0.exe"
                                    className="download-btn-primary"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    <span>Download for Windows</span>
                                </a>

                                <button
                                    className="copy-url-btn"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        const btn = document.querySelector('.copy-url-btn');
                                        btn.classList.add('copied');
                                        btn.querySelector('span').textContent = 'Copied!';
                                        setTimeout(() => {
                                            btn.classList.remove('copied');
                                            btn.querySelector('span').textContent = 'Copy Link';
                                        }, 2000);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                    </svg>
                                    <span>Copy Link</span>
                                </button>
                            </div>

                            <div className="system-requirements">
                                <div className="requirement">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="8" x="5" y="2" rx="2" /><rect width="20" height="8" x="2" y="14" rx="2" /><path d="M6 18h2" /><path d="M12 18h6" /></svg>
                                    <span>Windows 10+</span>
                                </div>
                                <div className="requirement">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                                    <span>Admin Required</span>
                                </div>
                                <div className="requirement version">
                                    <span>v1.0.0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Back to Home */}
            <section className="back-home-section">
                <Link to="/" className="back-link scroll-reveal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                    Back to Portfolio
                </Link>
            </section>
        </main>
    );
};

export default Download;

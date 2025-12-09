import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/download.css';

const Download = () => {
    useEffect(() => {
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

        // Parallax effect on floating shapes
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;

            document.querySelectorAll('.float-shape').forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Download button hover effect - ripple
        const buttons = document.querySelectorAll('.download-btn');
        const handleMouseEnter = function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            ripple.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
      `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        };

        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', handleMouseEnter);
        });

        // Add ripple animation keyframes
        const style = document.createElement('style');
        style.innerHTML = `
      @keyframes ripple {
        to {
          transform: translate(-50%, -50%) scale(15);
          opacity: 0;
        }
      }
    `;
        document.head.appendChild(style);

        return () => {
            revealObserver.disconnect();
            window.removeEventListener('mousemove', handleMouseMove);
            buttons.forEach(btn => {
                btn.removeEventListener('mouseenter', handleMouseEnter);
            });
            style.remove();
        };
    }, []);

    return (
        <main>
            {/* Hero Section */}
            <section className="download-hero">
                <div className="container">
                    <div className="download-hero-content">
                        <span className="download-badge scroll-reveal">📦 Resources</span>
                        <h1 className="download-title scroll-reveal">Downloads</h1>
                        <p className="download-subtitle scroll-reveal">Access my resume, portfolio materials, and project resources</p>
                    </div>

                    {/* Animated floating elements */}
                    <div className="floating-elements">
                        <div className="float-shape shape-1"></div>
                        <div className="float-shape shape-2"></div>
                        <div className="float-shape shape-3"></div>
                    </div>
                </div>
            </section>

            {/* Downloads Section */}
            <section className="downloads-section section">
                <div className="container">

                    {/* Resume Downloads */}
                    <div className="download-category scroll-reveal-left">
                        <div className="category-header">
                            <div className="category-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                            <h2 className="category-title">Resume & CV</h2>
                        </div>

                        <div className="download-cards">
                            <div className="download-card scroll-reveal-up" style={{ '--delay': '0.1s' }}>
                                <div className="card-glow"></div>
                                <div className="card-content">
                                    <h3>Full Resume</h3>
                                    <p>Complete professional resume with all experience, skills, and certifications</p>
                                    <div className="card-meta">
                                        <span className="file-type">PDF</span>
                                        <span className="file-size">~500 KB</span>
                                    </div>
                                    <a href="#" className="download-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Download
                                    </a>
                                </div>
                            </div>

                            <div className="download-card scroll-reveal-up" style={{ '--delay': '0.2s' }}>
                                <div className="card-glow"></div>
                                <div className="card-content">
                                    <h3>One-Page Resume</h3>
                                    <p>Compact single-page resume highlighting key skills and recent experience</p>
                                    <div className="card-meta">
                                        <span className="file-type">PDF</span>
                                        <span className="file-size">~200 KB</span>
                                    </div>
                                    <a href="#" className="download-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal divider */}
                    <div className="section-divider scroll-reveal">
                        <div className="divider-line"></div>
                        <div className="divider-dot"></div>
                        <div className="divider-line"></div>
                    </div>

                    {/* Portfolio Downloads */}
                    <div className="download-category scroll-reveal-right">
                        <div className="category-header">
                            <div className="category-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                    <line x1="8" y1="21" x2="16" y2="21"></line>
                                    <line x1="12" y1="17" x2="12" y2="21"></line>
                                </svg>
                            </div>
                            <h2 className="category-title">Portfolio Materials</h2>
                        </div>

                        <div className="download-cards">
                            <div className="download-card scroll-reveal-up" style={{ '--delay': '0.1s' }}>
                                <div className="card-glow"></div>
                                <div className="card-content">
                                    <h3>Portfolio Deck</h3>
                                    <p>Visual presentation of my best work with project case studies</p>
                                    <div className="card-meta">
                                        <span className="file-type">PDF</span>
                                        <span className="file-size">~2 MB</span>
                                    </div>
                                    <a href="#" className="download-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Download
                                    </a>
                                </div>
                            </div>

                            <div className="download-card scroll-reveal-up" style={{ '--delay': '0.2s' }}>
                                <div className="card-glow"></div>
                                <div className="card-content">
                                    <h3>Design Assets</h3>
                                    <p>Collection of UI/UX design samples and mockups from various projects</p>
                                    <div className="card-meta">
                                        <span className="file-type">ZIP</span>
                                        <span className="file-size">~5 MB</span>
                                    </div>
                                    <a href="#" className="download-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal divider */}
                    <div className="section-divider scroll-reveal">
                        <div className="divider-line"></div>
                        <div className="divider-dot"></div>
                        <div className="divider-line"></div>
                    </div>

                    {/* Tools & Resources */}
                    <div className="download-category scroll-reveal-left">
                        <div className="category-header">
                            <div className="category-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                                </svg>
                            </div>
                            <h2 className="category-title">Tools & Resources</h2>
                        </div>

                        <div className="download-cards three-cols">
                            <div className="download-card scroll-reveal-up" style={{ '--delay': '0.1s' }}>
                                <div className="card-glow"></div>
                                <div className="card-content">
                                    <h3>Code Snippets</h3>
                                    <p>Useful code snippets and templates I use regularly</p>
                                    <div className="card-meta">
                                        <span className="file-type">ZIP</span>
                                        <span className="file-size">~1 MB</span>
                                    </div>
                                    <a href="#" className="download-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Download
                                    </a>
                                </div>
                            </div>

                            <div className="download-card scroll-reveal-up" style={{ '--delay': '0.2s' }}>
                                <div className="card-glow"></div>
                                <div className="card-content">
                                    <h3>Development Cheatsheet</h3>
                                    <p>Quick reference guide for common development tasks</p>
                                    <div className="card-meta">
                                        <span className="file-type">PDF</span>
                                        <span className="file-size">~300 KB</span>
                                    </div>
                                    <a href="#" className="download-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Download
                                    </a>
                                </div>
                            </div>

                            <div className="download-card scroll-reveal-up" style={{ '--delay': '0.3s' }}>
                                <div className="card-glow"></div>
                                <div className="card-content">
                                    <h3>Project Starter Kit</h3>
                                    <p>Boilerplate templates for new web projects</p>
                                    <div className="card-meta">
                                        <span className="file-type">ZIP</span>
                                        <span className="file-size">~800 KB</span>
                                    </div>
                                    <a href="#" className="download-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* CTA Section */}
            <section className="download-cta section">
                <div className="container">
                    <div className="cta-wrapper scroll-reveal-scale">
                        <div className="cta-content">
                            <h2>Need Something Specific?</h2>
                            <p>If you're looking for something not listed here, feel free to reach out!</p>
                            <Link to="/#contact" className="btn btn-primary">Get In Touch</Link>
                        </div>
                        <div className="cta-decoration">
                            <div className="cta-ring"></div>
                            <div className="cta-ring"></div>
                            <div className="cta-ring"></div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Download;

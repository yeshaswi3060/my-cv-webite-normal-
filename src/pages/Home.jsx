import { useEffect } from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Certifications from '../components/sections/Certifications';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';

const Home = () => {
    useEffect(() => {
        // Scroll Animations (Reveal on Scroll)
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Elements to animate
        const animatedElements = document.querySelectorAll(
            '.section-title, .about-content, .skill-category, .timeline-item, .project-card, .contact-wrapper, .certification-card'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Add CSS for active state
        const style = document.createElement('style');
        style.innerHTML = `
      .section-title.active, 
      .about-content.active, 
      .skill-category.active, 
      .timeline-item.active, 
      .project-card.active, 
      .contact-wrapper.active,
      .certification-card.active {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
        document.head.appendChild(style);

        return () => {
            observer.disconnect();
            style.remove();
        };
    }, []);

    return (
        <main>
            <Hero />
            <About />
            <Skills />
            <Certifications />
            <Experience />
            <Projects />
            <Contact />
        </main>
    );
};

export default Home;

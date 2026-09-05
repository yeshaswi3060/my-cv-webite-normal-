import { useEffect, useRef } from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Certifications from '../components/sections/Certifications';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';

export default function Home() {
  const progressRef = useRef(null);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer;
    const elements = [...document.querySelectorAll('.reveal')];
    function setupReveal() {
      observer?.disconnect();
      if (motion.matches || !('IntersectionObserver' in window)) {
        elements.forEach(element => element.classList.add('revealed')); return;
      }
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
      elements.forEach(element => { element.classList.add('reveal-ready'); observer.observe(element); });
    }
    setupReveal(); motion.addEventListener('change', setupReveal);
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        progressRef.current?.style.setProperty('--progress', height > 0 ? String(window.scrollY / height) : '0');
      });
    };
    window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update); update();
    return () => { observer?.disconnect(); motion.removeEventListener('change', setupReveal); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); cancelAnimationFrame(frame); };
  }, []);
  return <main id="main-content" tabIndex={-1}>
    <div className="reading-progress" aria-hidden="true" ref={progressRef} />
    <Hero /><Projects /><About /><Skills /><Experience /><Certifications /><Contact />
  </main>;
}


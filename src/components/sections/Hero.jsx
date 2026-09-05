import { ArrowDown, ArrowUpRight, Github } from 'lucide-react';
import ProjectStage from '../ProjectStage';
export default function Hero() {
  return <section id="home" className="hero" aria-labelledby="hero-heading"><div className="container">
    <div className="hero-topline"><span>INDEPENDENT DEVELOPER & RESEARCHER</span><span>DELHI, INDIA / PORTFOLIO 2026</span></div>
    <h1 id="hero-heading" className="hero-name"><span>YESHASWI</span> <span>SINGH<span className="name-period">.</span></span></h1>
    <div className="hero-main">
      <div className="hero-profile"><span className="hero-role-index">BUILDING AT THE INTERSECTION</span><h2>Full-stack development.<br /><span>Security-first thinking.</span></h2><p>I’m Yeshaswi. I build digital products with thoughtful interfaces, solid engineering, and security at their core.</p><a href="#projects" className="hero-work-link">Discover my work <ArrowUpRight size={22} /></a></div>
      <ProjectStage />
    </div>
    <div className="hero-bottom"><a href="#projects" className="scroll-link"><span className="scroll-circle"><ArrowDown size={17} /></span> SCROLL TO EXPLORE</a><span className="hero-availability"><span className="status-dot" /> Open to freelance & full-time opportunities</span><a href="https://github.com/yeshaswi3060" target="_blank" rel="noreferrer" className="hero-github"><Github size={17} /> GitHub <ArrowUpRight size={15} /></a></div>
  </div></section>;
}


import { ArrowUpRight } from 'lucide-react';
const jobs = [
  { year: '2025', role: 'Web Developer Intern', company: 'Gully Classes Foundation', category: 'DEVELOPMENT', text: 'Developed responsive web pages and managed content flow using modern HTML and CSS, with a focus on improving accessibility.', tags: ['Responsive web', 'Accessibility', 'HTML / CSS'] },
  { year: '2024', role: 'Cyber Security Researcher', company: 'CrowdStrike', category: 'RESEARCH', text: 'Analyzed malware samples and emerging threat vectors, contributing to proactive defense strategies and endpoint security enhancements.', tags: ['Malware analysis', 'Threat research', 'Endpoint security'] },
  { year: '2023', role: 'Threat Hunter Intern', company: 'SentinelOne', category: 'SECURITY', text: 'Monitored network traffic for anomalous behavior and assisted with incident response using AI-driven security platforms.', tags: ['Threat hunting', 'Network analysis', 'Incident response'] },
];
export default function Experience() {
  return <section id="experience" className="section experience-section"><div className="container experience-layout">
    <div className="experience-intro reveal"><p className="section-kicker"><span>04</span> THE JOURNEY</p><h2>Experience<br />that shapes<br /><em>my perspective.</em></h2><p>Building, investigating, and learning along the way.</p><a href="#contact" className="text-link">Let’s work together <ArrowUpRight size={17} /></a></div>
    <div className="experience-list">{jobs.map(job => <article key={job.year} className="experience-entry reveal"><div className="experience-meta"><span className="experience-year">{job.year}</span><span>{job.category}</span></div><h3>{job.role}</h3><p className="experience-company">{job.company}</p><p className="experience-description">{job.text}</p><div className="experience-tags">{job.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}</div>
  </div></section>;
}


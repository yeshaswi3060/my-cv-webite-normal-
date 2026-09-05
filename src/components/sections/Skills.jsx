import { Layers3, Server, Shield, ScanLine } from 'lucide-react';
import SectionHeading from '../SectionHeading';
import Tilt from '../Tilt';
const categories = [
  { Icon: Layers3, title: 'Interfaces & experiences', text: 'Responsive, intuitive frontends with attention to the details that people feel.', tags: ['React', 'JavaScript', 'HTML / CSS', 'Tailwind CSS', 'Electron', 'Figma'] },
  { Icon: Server, title: 'Systems & architecture', text: 'The APIs, data flows, and infrastructure that bring a product together.', tags: ['Node.js / Express', 'Python', 'REST APIs', 'MongoDB / SQL', 'Docker', 'Git / CI/CD'] },
  { Icon: ScanLine, title: 'Offensive security', text: 'An investigative mindset for understanding weaknesses before they become problems.', tags: ['Penetration testing', 'Burp Suite', 'Kali Linux', 'Nmap', 'Wireshark', 'Metasploit'] },
  { Icon: Shield, title: 'Defense & resilience', text: 'Security considerations throughout the lifecycle, not just at the finish line.', tags: ['Threat modeling', 'Incident response', 'Network security', 'Cryptography', 'Security auditing'] },
];
export default function Skills() {
  return <section id="skills" className="section expertise-section"><div className="container">
    <SectionHeading number="03" label="EXPERTISE" description="From the first interaction to the systems underneath. Development and security, considered together.">The full stack.<br /><em>Every layer considered.</em></SectionHeading>
    <div className="expertise-grid">{categories.map(({ Icon, title, text, tags }, i) => <Tilt key={title} className="expertise-card reveal">
      <div className="expertise-top"><span className="expertise-icon"><Icon size={26} strokeWidth={1.4} /></span><span>0{i + 1} / 04</span></div><h3>{title}</h3><p>{text}</p><div className="tech-tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div>
    </Tilt>)}</div>
    <div className="toolkit-note reveal"><span className="status-dot" /><p>Different tools. One standard: <strong>make it work beautifully.</strong></p><span className="mono">ALWAYS LEARNING ↗</span></div>
  </div></section>;
}


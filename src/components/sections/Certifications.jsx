import { ArrowUpRight, Plus, Award } from 'lucide-react';
import SectionHeading from '../SectionHeading';
const certifications = [
  { mark: 'Ox', name: 'Oxford Machine Learning Summer School', issuer: 'AI for Global Goals · Oxford Deep Medicine', year: '2025', image: 'Screenshot 2025-11-24 110747.png' },
  { mark: 'M', name: 'Front-End Developer Professional Certificate', issuer: 'Meta · Coursera', year: '2024', image: 'Screenshot 2025-11-26 131043.png' },
  { mark: 'CS50', name: 'CS50x: Computer Science', issuer: 'Harvard University', year: '2020', image: 'Screenshot 2025-11-24 111523.png' },
  { mark: 'W3C', name: 'Introduction to Web Accessibility', issuer: 'W3Cx · World Wide Web Consortium', year: '2020', image: 'Screenshot 2025-11-26 130524.png' },
  { mark: 'fCC', name: 'Legacy Full Stack Developer', issuer: 'freeCodeCamp', year: '2020', image: 'Screenshot 2025-11-26 133013.png' },
  { mark: 'ERT', name: 'Extreme Red Teamer Lab', issuer: 'Extreme Red Team Laboratories', year: '2025', image: 'Screenshot 2025-11-26 133521.png' },
];
export default function Certifications() {
  return <section id="certifications" className="section credentials-section"><div className="container">
    <SectionHeading number="05" label="CONTINUOUS LEARNING" aside={<p>Curiosity is a practice.<br />These are a few milestones.</p>}>Never stop<br /><em>getting better.</em></SectionHeading>
    <div className="credentials-grid">{certifications.map(cert => <a className="credential reveal" key={cert.name} href={`/${encodeURIComponent(cert.image)}`} target="_blank" rel="noreferrer" aria-label={`View ${cert.name} certificate`}><div className="credential-top"><span className={`credential-mark ${cert.mark === 'M' ? 'meta-mark' : ''}`}>{cert.mark}</span><span>{cert.year}</span></div><h3>{cert.name}</h3><p>{cert.issuer}</p><span className="credential-link">View certificate <ArrowUpRight size={16} /></span></a>)}</div>
    <details className="more-credentials reveal"><summary><span><Award size={18} /> Additional certifications & internships</span><Plus size={20} /></summary><div className="additional-credentials"><div><h3>Certified Ethical Hacker (CEH)</h3><p>EC-Council · 2025</p></div><div><h3>Internship Certificate</h3><p>Connecting For · 2025</p></div><div><h3>Internship Certificate</h3><p>Gully Classes Foundation · 2025</p></div></div></details>
  </div></section>;
}


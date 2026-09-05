import { ArrowUpRight, ArrowRight, BookOpen, LockKeyhole } from 'lucide-react';
function BrowserBar({ name }) {
  return <div className="project-browser-bar"><span className="browser-dots"><i /><i /><i /></span><span>{name}</span><ArrowUpRight size={12} /></div>;
}
export function LearnovaPreview() {
  return <div className="learnova-preview" aria-label="Illustrative interface preview of the Learnova practice paper project">
    <div className="learnova-window"><BrowserBar name="learnova / practice with purpose" /><div className="learnova-ui"><div className="learnova-ui-top"><strong>learnova<span>®</span></strong><span>UPSC CIVIL SERVICES</span></div><div className="learnova-ui-body"><div><span className="preview-overline">PREPARATION, WITH PURPOSE</span><h4>Master the Mains.<br /><em>One paper<br />at a time.</em></h4><p>A focused practice set.<br />A sharper way to prepare.</p><span className="preview-cta">Explore the practice set <ArrowUpRight size={13} /></span></div><div className="paper-preview"><BookOpen size={22} strokeWidth={1.4} /><span>UPSC CIVIL SERVICES · MAINS</span><h5>General Studies<br />Paper II</h5><div className="paper-rule" /><p>GOVERNANCE. CONSTITUTION.<br />POLITY. SOCIAL JUSTICE.</p><div className="paper-lines"><i /><i /><i /></div><div className="paper-footer"><span>PRACTICE SET 2026</span><span>01</span></div></div></div><div className="learnova-ui-footer"><span>QUESTION PAPER</span><span>ANSWER KEY</span><span>DETAILED SOLUTIONS</span></div></div></div>
  </div>;
}
export function VatsalyaPreview() {
  return <div className="vatsalya-preview" aria-label="Illustrative interface preview of Vatsalya Boutique using its original product photography"><div className="vatsalya-window"><BrowserBar name="vatsalya / a celebration of craft" /><div className="vatsalya-ui"><div className="vatsalya-nav"><strong>VATSALYA</strong><span>THE COLLECTION</span></div><div className="vatsalya-body"><div><span>TRADITION, REIMAGINED.</span><h4>Woven with<br /><em>stories.</em></h4><p>Discover the saree collection.</p><span className="vatsalya-action">EXPLORE <ArrowRight size={13} /></span></div><img src="/projects/vatsalya-saree.webp" width="600" height="900" alt="Saree from the Vatsalya Boutique collection" loading="lazy" /></div></div></div></div>;
}
export function SpherePreview() {
  return <div className="sphere-preview" aria-label="Illustrative interface preview of the Sphere authentication project"><div className="sphere-window"><BrowserBar name="sphere / connected experiences" /><div className="sphere-ui"><div className="sphere-brand"><span className="sphere-brand-symbol">s.</span> sphere</div><div className="sphere-login"><div className="sphere-lock"><LockKeyhole size={23} strokeWidth={1.3} /></div><h4>Your next chapter<br />starts here.</h4><p>One account. A connected workspace.</p><div className="preview-input">Email address <span>↗</span></div><div className="preview-input">Password <span>········</span></div><span className="sphere-signin">Continue <ArrowRight size={13} /></span><div className="sphere-providers"><span>Google</span><span>Microsoft</span><span>Apple</span></div></div></div></div></div>;
}


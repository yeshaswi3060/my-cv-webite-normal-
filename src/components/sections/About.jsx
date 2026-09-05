import { ArrowUpRight, Code2, Fingerprint, Sparkles } from 'lucide-react';
export default function About() {
  return <section id="about" className="section about-section">
    <div className="container">
      <p className="section-kicker reveal"><span>02</span> BEHIND THE CODE</p>
      <div className="about-layout">
        <div className="about-photo-wrap reveal">
          <div className="about-photo"><img src="/profile-image.jpg" alt="Yeshaswi playing guitar in a garden surrounded by mountains" loading="lazy" width="960" height="960" /><div className="photo-caption"><span>MORE THAN A TERMINAL.</span><span>Always curious. ↗</span></div></div>
          <div className="photo-footnote"><span>YESHASWI SINGH</span><span>DELHI, INDIA</span></div>
        </div>
        <div className="about-story reveal">
          <h2>A builder’s curiosity.<br /><em>A defender’s instinct.</em></h2>
          <p>I’m Yeshaswi, a <strong>full-stack developer and cybersecurity researcher</strong>. I enjoy connecting the dots between how something looks, how it works, and how it can work better.</p>
          <p>From responsive React interfaces to backend systems and security research, I bring an end-to-end perspective. My approach is simple: understand the problem, question the assumptions, and build with intention.</p>
          <div className="about-principles"><span><Code2 size={17} /> Build thoughtfully</span><span><Fingerprint size={17} /> Think securely</span><span><Sparkles size={17} /> Refine relentlessly</span></div>
          <a href="#experience" className="text-link">The journey so far <ArrowUpRight size={17} /></a>
        </div>
      </div>
    </div>
  </section>;
}


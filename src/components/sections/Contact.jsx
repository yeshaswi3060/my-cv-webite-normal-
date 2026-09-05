import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, MapPin, Phone } from 'lucide-react';
export default function Contact() {
  const [copyState, setCopyState] = useState('');
  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('yeshaswi3@gmail.com');
      setCopyState('Email copied');
    } catch {
      setCopyState('Select the email address to copy it, or click it to get in touch.');
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopyState(''), 4000);
  }
  return <section id="contact" className="contact-section"><div className="container">
    <div className="contact-panel reveal"><div className="contact-orbits" aria-hidden="true" />
      <div className="contact-top"><p className="section-kicker"><span>06</span> THE NEXT CHAPTER</p><span className="contact-availability"><span className="status-dot" /> Open to opportunities</span></div>
      <h2>Have something in mind?<br /><em>Let’s build it right.</em></h2>
      <p className="contact-description">A product to launch, a problem to solve, or a team to join.<br />I’d love to hear what you’re working on.</p>
      <div className="contact-email-row"><a className="contact-email" href="mailto:yeshaswi3@gmail.com">yeshaswi3@gmail.com <ArrowUpRight /></a><button onClick={copyEmail} className="copy-email" aria-label="Copy email address">{copyState === 'Email copied' ? <Check size={18} /> : <Copy size={18} />}</button></div>
      <p className="copy-status" aria-live="polite" role="status">{copyState}</p>
      <div className="contact-bottom"><span><MapPin size={16} /> Dwarka, Delhi, India</span><a href="tel:+917982344263"><Phone size={15} /> +91 79823 44263</a><a href="https://github.com/yeshaswi3060" target="_blank" rel="noreferrer">Find me on GitHub <ArrowUpRight size={16} /></a></div>
    </div>
  </div></section>;
}


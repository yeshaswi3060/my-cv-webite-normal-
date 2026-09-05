import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveUpRight } from 'lucide-react';
import { LearnovaPreview, VatsalyaPreview, SpherePreview } from './ProjectPreviews';
const projects = [
  { title: 'Learnova', type: 'EDUCATION PLATFORM', url: 'https://upsc-inky.vercel.app', Preview: LearnovaPreview },
  { title: 'Vatsalya Boutique', type: 'DIGITAL STOREFRONT', url: 'https://clothing-web-vatsalya.vercel.app', Preview: VatsalyaPreview },
  { title: 'Sphere', type: 'AUTHENTICATION EXPERIENCE', url: 'https://vastu-sphere.vercel.app', Preview: SpherePreview },
];
export default function ProjectStage() {
  const [selected, setSelected] = useState(0);
  const stageRef = useRef(null);
  const pointerRef = useRef(null);
  const frameRef = useRef(0);
  const change = direction => setSelected(current => (current + direction + projects.length) % projects.length);
  useEffect(() => {
    const stage = stageRef.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const scroll = () => {
      if (motion.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = stage.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const amount = Math.max(-1, Math.min(1, (rect.top - window.innerHeight * .3) / window.innerHeight));
        stage.style.setProperty('--scroll-depth', `${amount * 5}deg`);
      });
    };
    const reset = () => {
      if (motion.matches) { stage.style.setProperty('--scroll-depth', '0deg'); stage.style.setProperty('--stage-x', '0deg'); stage.style.setProperty('--stage-y', '0deg'); }
    };
    window.addEventListener('scroll', scroll, { passive: true }); motion.addEventListener('change', reset); scroll();
    return () => { window.removeEventListener('scroll', scroll); motion.removeEventListener('change', reset); cancelAnimationFrame(frame); cancelAnimationFrame(frameRef.current); };
  }, []);
  function move(event) {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      stageRef.current.style.setProperty('--stage-x', `${-y * 9}deg`);
      stageRef.current.style.setProperty('--stage-y', `${x * 13}deg`);
      stageRef.current.style.setProperty('--light-x', `${(x + .5) * 100}%`);
      stageRef.current.style.setProperty('--light-y', `${(y + .5) * 100}%`);
    });
  }
  function leave() {
    cancelAnimationFrame(frameRef.current);
    stageRef.current.style.setProperty('--stage-x', '0deg');
    stageRef.current.style.setProperty('--stage-y', '0deg');
  }
  function pointerUp(event) {
    if (pointerRef.current && event.pointerType === 'touch') {
      const distance = event.clientX - pointerRef.current.x;
      if (Math.abs(distance) > 45) change(distance > 0 ? -1 : 1);
    }
    pointerRef.current = null;
  }
  return <div className="project-stage" ref={stageRef} role="region" aria-label="Interactive 3D featured projects" aria-roledescription="carousel" onPointerMove={move} onPointerLeave={leave} onPointerDown={event => { pointerRef.current = { x: event.clientX }; }} onPointerUp={pointerUp} onPointerCancel={() => { pointerRef.current = null; }} onKeyDown={event => { if (event.key === 'ArrowRight') { event.preventDefault(); change(1); } if (event.key === 'ArrowLeft') { event.preventDefault(); change(-1); } }}>
    <div className="stage-label"><span>SELECTED DIGITAL EXPERIENCES</span><span><MoveUpRight size={12} /> MOVE TO EXPLORE</span></div>
    <div className="stage-perspective"><div className="stage-world">
      {projects.map(({ title, url, Preview }, index) => {
        const position = (index - selected + projects.length) % projects.length;
        return <div className={`stage-screen stage-position-${position}`} key={title} aria-hidden={position !== 0} inert={position !== 0}>
          <a href={url} target="_blank" rel="noreferrer" aria-label={`Visit ${title} website`} tabIndex={position === 0 ? 0 : -1}><Preview /><span className="stage-open"><ArrowUpRight size={20} /></span></a>
        </div>;
      })}
    </div></div>
    <div className="stage-controls"><div className="stage-project-name" aria-live="polite"><span>0{selected + 1} / 03</span><strong>{projects[selected].title}</strong></div><div className="stage-buttons"><button onClick={() => change(-1)} aria-label="Previous featured project"><ArrowLeft size={17} /></button><button onClick={() => change(1)} aria-label="Next featured project"><ArrowRight size={17} /></button></div></div>
  </div>;
}


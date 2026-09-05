import { useRef } from 'react';
export default function Tilt({ children, className = '' }) {
  const ref = useRef(null);
  function move(event) {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const element = ref.current;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    element.style.setProperty('--rx', `${(0.5 - y) * 5}deg`);
    element.style.setProperty('--ry', `${(x - 0.5) * 5}deg`);
    element.style.setProperty('--mx', `${x * 100}%`);
    element.style.setProperty('--my', `${y * 100}%`);
  }
  function reset() { ref.current.style.setProperty('--rx', '0deg'); ref.current.style.setProperty('--ry', '0deg'); }
  return <div ref={ref} className={`tilt-surface ${className}`} onPointerMove={move} onPointerLeave={reset}>{children}</div>;
}


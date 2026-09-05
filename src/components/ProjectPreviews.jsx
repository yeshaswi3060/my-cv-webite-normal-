import { ArrowUpRight, ArrowRight } from 'lucide-react';
export default function ProjectPreview({ project }) {
  return <div className={`client-preview client-${project.id}`} aria-hidden="true">
    <div className="client-window">
      <div className="project-browser-bar"><span className="browser-dots"><i /><i /><i /></span><span>{project.domain}</span><ArrowUpRight size={12} /></div>
      <div className="client-canvas">
        {project.id === 'pallora' && <><div className="pallora-nav"><span>PALLORA</span><span>THE COLLECTION</span></div><div className="pallora-copy"><span>INDO-WESTERN, REIMAGINED</span><h4>A new vision<br /><em>of fusion.</em></h4><span className="client-mini-link">EXPLORE THE EDIT <ArrowRight size={12} /></span></div><img className="pallora-model" src={project.image} alt={project.imageAlt} width="1000" height="1000" loading="lazy" /></>}
        {project.id === 'vastushikhar' && <><img className="vastu-brand-image" src={project.image} alt={project.imageAlt} width="1000" height="525" loading="lazy" /><div className="vastu-services"><span>CONSULTATIONS</span><span>LEARNING</span><span>INSIGHTS <ArrowUpRight size={11} /></span></div></>}
        {project.id === 'malyam' && <><div className="malyam-nav"><strong>malyam<span>®</span></strong><span>SPIRITUAL ESSENTIALS</span></div><img className="malyam-campaign" src={project.image} alt={project.imageAlt} width="1000" height="473" loading="lazy" /><div className="malyam-collections"><span>VASTU REMEDIES</span><span>RUDRAKSHA</span><span>SPIRITUAL LIVING</span></div></>}
        {project.id === 'allcloths' && <div className="allcloths-brand"><div><span>WEB EXPERIENCE</span><ArrowUpRight size={17} /></div><h4>ALL<br /><span>CLOTHS.</span></h4><div><span>ALLCLOTHS.COM</span><span>EXPLORE THE WEBSITE →</span></div></div>}
      </div>
    </div>
  </div>;
}


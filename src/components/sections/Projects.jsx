import { ArrowUpRight, Github } from 'lucide-react';
import SectionHeading from '../SectionHeading';
import Tilt from '../Tilt';
import ProjectPreview from '../ProjectPreviews';
import { featuredProjects, repositoryProjects } from '../../data/projects';

export default function Projects() {
  return <section id="projects" className="section projects-section"><div className="container">
    <SectionHeading number="01" label="SELECTED WEBSITES" aside={<a href="https://github.com/yeshaswi3060?tab=repositories" className="text-link" target="_blank" rel="noreferrer">Explore my GitHub <ArrowUpRight size={17} /></a>}>Real brands.<br /><em>Distinct digital experiences.</em></SectionHeading>
    <div className="selected-projects">{featuredProjects.map((project, index) => <article key={project.id} className="work-card reveal">
      <Tilt className="project-preview-tilt"><a href={project.live} target="_blank" rel="noreferrer" className="project-preview-link" aria-label={`Open ${project.title} website`}><ProjectPreview project={project} /><span className="project-view-circle"><ArrowUpRight size={23} /></span></a></Tilt>
      <div className="work-details"><div className="work-meta"><span>{project.category}</span><span>0{index + 1}</span></div><div className="work-title-row"><h3><a href={project.live} target="_blank" rel="noreferrer">{project.title} <ArrowUpRight size={24} /></a></h3></div><p>{project.description}</p><div className="work-footer"><div className="tech-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a href={project.live} target="_blank" rel="noreferrer" className="project-source">Visit website <ArrowUpRight size={15} /></a></div><div className="work-domain"><span>{project.domain}</span>{project.github && <a href={project.github} target="_blank" rel="noreferrer"><Github size={13} /> Source code <ArrowUpRight size={12} /></a>}</div></div>
    </article>)}</div>
    <div className="more-work reveal"><h3>Open-source<br />& explorations</h3>{repositoryProjects.map(([repo, title, category]) => <a key={repo} href={`https://github.com/yeshaswi3060/${repo}`} target="_blank" rel="noreferrer"><span>{title}</span><span className="more-work-category">{category}</span><ArrowUpRight size={21} /></a>)}</div>
  </div></section>;
}


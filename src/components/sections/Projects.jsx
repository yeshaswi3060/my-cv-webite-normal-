import { LearnovaPreview, VatsalyaPreview, SpherePreview } from '../ProjectPreviews';
import { ArrowUpRight, Github } from 'lucide-react';
import SectionHeading from '../SectionHeading';
import Tilt from '../Tilt';

const projects = [
  { title: 'Learnova', category: 'EDUCATION / WEB APPLICATION', year: '2026', description: 'A focused UPSC preparation experience with practice papers, a document reader, and a purchase-to-library flow.', tags: ['React', 'JavaScript', 'Razorpay'], github: 'UPSC', live: 'https://upsc-inky.vercel.app', Preview: LearnovaPreview, featured: true },
  { title: 'Vatsalya Boutique', category: 'FASHION / DIGITAL STOREFRONT', year: '2026', description: 'An image-led boutique website that puts the saree collection first, with dedicated collection and product gallery views.', tags: ['React', 'CSS', 'Vite'], github: 'clothing-web-vatsalya', live: 'https://clothing-web-vatsalya.vercel.app', Preview: VatsalyaPreview },
  { title: 'Sphere', category: 'PRODUCT / AUTHENTICATION UI', year: '2026', description: 'A TypeScript interface exploring sign-in, social authentication flows, and a connected account dashboard.', tags: ['React', 'TypeScript', 'Tailwind CSS'], github: 'Sphere', live: 'https://vastu-sphere.vercel.app', Preview: SpherePreview },
];
const more = [
  ['web-data-scraper', 'Web Data Scraper', 'HTML / DATA TOOLS'],
  ['Advanced-wifi-scaner', 'Advanced Wi-Fi Scanner', 'PYTHON / NETWORKING'],
  ['Search-Engine', 'Search Engine', 'PYTHON / SEARCH'],
];
export default function Projects() {
  return <section id="projects" className="section projects-section"><div className="container">
    <SectionHeading number="01" label="SELECTED WORK" aside={<a href="https://github.com/yeshaswi3060?tab=repositories" className="text-link" target="_blank" rel="noreferrer">All repositories <ArrowUpRight size={17} /></a>}>Ideas, made real<span className="accent-period">.</span></SectionHeading>
    <div className="selected-projects">{projects.map(({ title, category, year, description, tags, github, live, Preview, featured }, index) => <article key={title} className={`work-card reveal ${featured ? 'work-featured' : ''}`}>
      <Tilt className="project-preview-tilt"><a href={live} target="_blank" rel="noreferrer" className="project-preview-link" aria-label={`Open ${title} website`}><Preview /><span className="project-view-circle"><ArrowUpRight size={23} /></span></a></Tilt>
      <div className="work-details"><div className="work-meta"><span>{category}</span><span>{year}</span></div><div className="work-title-row"><h3><a href={live} target="_blank" rel="noreferrer">{title} <ArrowUpRight size={24} /></a></h3><span className="work-number">0{index + 1}</span></div><p>{description}</p><div className="work-footer"><div className="tech-tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div><a href={`https://github.com/yeshaswi3060/${github}`} target="_blank" rel="noreferrer" className="project-source"><Github size={15} /> Source <ArrowUpRight size={13} /></a></div></div>
    </article>)}</div>
    <div className="more-work reveal"><h3>More explorations</h3>{more.map(([repo, title, category]) => <a key={repo} href={`https://github.com/yeshaswi3060/${repo}`} target="_blank" rel="noreferrer"><span>{title}</span><span className="more-work-category">{category}</span><ArrowUpRight size={21} /></a>)}</div>
  </div></section>;
}



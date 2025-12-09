const Projects = () => {
    const projects = [
        {
            title: "Employee Monitoring App",
            description: "A cross-platform desktop application to track employee activity, keystrokes, and screen time.",
            tech: ["Python", "ElectronJS"]
        },
        {
            title: "Gully Classes Website",
            description: "Responsive, multilingual educational website with CMS integration. Focused on SEO and accessibility.",
            tech: ["HTML/CSS", "JS", "SEO"]
        },
        {
            title: "E-commerce Storefront",
            description: "Shopify-based storefront with optimized checkout flow and mobile-first design.",
            tech: ["Shopify", "Liquid", "CSS"]
        },
        {
            title: "Vastu Shikhar",
            description: "Elegant design with interactive Vastu tools and custom animations.",
            tech: ["Vanilla JS", "CSS Animations"]
        }
    ];

    return (
        <section id="projects" className="section projects-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Featured Projects</h2>
                    <div className="section-line"></div>
                </div>

                <div className="projects-grid">
                    {projects.map((project, index) => (
                        <article className="project-card" key={index}>
                            <div className="project-content">
                                <h3>{project.title}</h3>
                                <p className="project-desc">{project.description}</p>
                                <div className="project-tech">
                                    {project.tech.map((tech, i) => (
                                        <span key={i}>{tech}</span>
                                    ))}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;

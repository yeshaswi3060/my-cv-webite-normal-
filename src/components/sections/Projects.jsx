const Projects = () => {
    const projects = [
        {
            title: "Employee Monitoring App",
            description: "A cross-platform desktop application to track employee activity, keystrokes, and screen time.",
            tech: ["Python", "ElectronJS"]
        },
        {
            title: "Interview Environment Simulator",
            description: "A sandbox environment designed to simulate various technical interview scenarios, allowing users to practice coding in a restricted, monitored setting.",
            tech: ["Docker", "Node.js", "Virtualization"]
        },
        {
            title: "Fake Punching System",
            description: "A security auditing tool for simulating attendance and check-in logs, designed for testing the robustness of biometric verification systems.",
            tech: ["Python", "API Spoofing", "Security"]
        },
        {
            title: "Interview Cheater App",
            description: "An AI-powered assistant providing real-time support and technical insights during coding interviews.",
            tech: ["React", "Node.js", "GPT API"]
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

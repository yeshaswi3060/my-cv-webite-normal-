const Projects = () => {
    const projects = [
        {
            title: "Modern E-Commerce Platform",
            description: "A full-stack e-commerce solution featuring a responsive React frontend, a secure Node.js REST API, Stripe payment integration, and a custom admin dashboard.",
            tech: ["React", "Node.js", "MongoDB", "Stripe"]
        },
        {
            title: "Real-Time AI Assistant",
            description: "An AI-powered web application providing real-time support and technical insights, utilizing WebSockets for instant communication.",
            tech: ["React", "Node.js", "GPT API", "WebSockets"]
        },
        {
            title: "Employee Monitoring App",
            description: "A cross-platform desktop application to track employee activity, keystrokes, and screen time securely.",
            tech: ["Python", "ElectronJS", "Security"]
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

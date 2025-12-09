const Skills = () => {
    return (
        <section id="skills" className="section skills-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Technical Arsenal</h2>
                    <div className="section-line"></div>
                </div>

                <div className="skills-grid">
                    <div className="skill-category">
                        <h3>Frontend</h3>
                        <div className="skill-tags">
                            <span>HTML5</span>
                            <span>CSS3</span>
                            <span>JavaScript (ES6+)</span>
                            <span>React</span>
                            <span>Angular</span>
                            <span>Tailwind</span>
                        </div>
                    </div>

                    <div className="skill-category">
                        <h3>Backend & Core</h3>
                        <div className="skill-tags">
                            <span>Python</span>
                            <span>C++</span>
                            <span>Node.js</span>
                            <span>API Integration</span>
                        </div>
                    </div>

                    <div className="skill-category">
                        <h3>Tools & Design</h3>
                        <div className="skill-tags">
                            <span>Git & GitHub</span>
                            <span>Figma</span>
                            <span>UI/UX Principles</span>
                            <span>VS Code</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;

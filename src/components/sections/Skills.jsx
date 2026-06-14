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
                        <h3>Frontend & UI/UX</h3>
                        <div className="skill-tags">
                            <span>React.js</span>
                            <span>HTML5 / CSS3</span>
                            <span>JavaScript (ES6+)</span>
                            <span>Tailwind CSS</span>
                            <span>ElectronJS</span>
                            <span>Figma & UI Design</span>
                        </div>
                    </div>

                    <div className="skill-category">
                        <h3>Backend & Systems</h3>
                        <div className="skill-tags">
                            <span>Node.js / Express</span>
                            <span>Python & Scripting</span>
                            <span>RESTful APIs</span>
                            <span>MongoDB / SQL</span>
                            <span>Docker</span>
                            <span>Git & CI/CD</span>
                        </div>
                    </div>

                    <div className="skill-category">
                        <h3>Offensive Security</h3>
                        <div className="skill-tags">
                            <span>Kali Linux</span>
                            <span>Metasploit</span>
                            <span>Nmap & Wireshark</span>
                            <span>Burp Suite</span>
                            <span>Penetration Testing</span>
                        </div>
                    </div>

                    <div className="skill-category">
                        <h3>Defensive & Core</h3>
                        <div className="skill-tags">
                            <span>Threat Modeling</span>
                            <span>Incident Response</span>
                            <span>Network Security</span>
                            <span>Cryptography</span>
                            <span>Security Auditing</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;

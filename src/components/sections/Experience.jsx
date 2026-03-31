const Experience = () => {
    return (
        <section id="experience" className="section experience-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Experience</h2>
                    <div className="section-line"></div>
                </div>

                <div className="timeline">
                    <div className="timeline-item">
                        <div className="timeline-date">2025</div>
                        <div className="timeline-content">
                            <h3>Web Developer Intern</h3>
                            <span className="company">Gully Classes Foundation</span>
                            <p>Developed responsive web pages and managed content flow using modern HTML5/CSS3 techniques, improving
                                site accessibility.</p>
                        </div>
                    </div>
                </div>
                <div className="timeline">
                    <div className="timeline-item">
                        <div className="timeline-date">2024</div>
                        <div className="timeline-content">
                            <h3>Cyber Security Researcher</h3>
                            <span className="company">CrowdStrike</span>
                            <p>Analyzed malware samples and identified emerging threat vectors, contributing to the development of proactive defense strategies and endpoint security enhancements.</p>
                        </div>
                    </div>
                </div>
                <div className="timeline">
                    <div className="timeline-item">
                        <div className="timeline-date">2023</div>
                        <div className="timeline-content">
                            <h3>Threat Hunter Intern</h3>
                            <span className="company">SentinelOne</span>
                            <p>Monitored network traffic for anomalous behavior and assisted in incident response procedures, leveraging AI-driven platforms to neutralize potential security breaches.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;

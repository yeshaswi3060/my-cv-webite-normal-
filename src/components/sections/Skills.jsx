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
                        <h3>Offensive Security</h3>
                        <div className="skill-tags">
                            <span>Kali Linux</span>
                            <span>Metasploit</span>
                            <span>Nmap & Wireshark</span>
                            <span>Burp Suite</span>
                            <span>Exploit Development</span>
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
                            <span>SIEM & SOC</span>
                        </div>
                    </div>

                    <div className="skill-category">
                        <h3>Development & Tools</h3>
                        <div className="skill-tags">
                            <span>Python (Sec Scripting)</span>
                            <span>Bash & Shell</span>
                            <span>Reverse Engineering</span>
                            <span>C++ / ASM</span>
                            <span>Docker & Git</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;

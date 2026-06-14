const Hero = () => {
    return (
        <section className="hero">
            <div className="container hero-container">
                <div className="hero-content">
                    <span className="hero-greeting">Hello, I'm</span>
                    <h1 className="hero-title">Yeshaswi Singh</h1>
                    <p className="hero-subtitle">Cyber Security Specialist | Full-Stack Web Developer</p>
                    <p className="hero-description">
                        I craft high-performance digital experiences that merge beautiful, intuitive design with robust engineering and secure-by-design architecture.
                    </p>
                    <div className="hero-buttons">
                        <a href="#projects" className="btn btn-primary">View Work</a>
                        <a href="#contact" className="btn btn-outline">Contact Me</a>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="profile-frame">
                        <img src="/profile-image.jpg" alt="Yeshaswi Singh" className="profile-img" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

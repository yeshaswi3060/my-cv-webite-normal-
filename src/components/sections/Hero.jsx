const Hero = () => {
    return (
        <section className="hero">
            <div className="container hero-container">
                <div className="hero-content">
                    <span className="hero-greeting">Hello, I'm</span>
                    <h1 className="hero-title">Yeshaswi Singh</h1>
                    <p className="hero-subtitle">Full Stack Developer & UI/UX Designer</p>
                    <p className="hero-description">
                        I craft high-performance digital experiences that merge beautiful design with robust engineering.
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

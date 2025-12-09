const Contact = () => {
    return (
        <section id="contact" className="section contact-section">
            <div className="container">
                <div className="contact-wrapper">
                    <div className="contact-header">
                        <h2 className="section-title">Get In Touch</h2>
                        <p>I'm currently open for freelance projects and full-time opportunities.</p>
                    </div>

                    <div className="contact-info">
                        <a href="mailto:yeshaswi3@gmail.com" className="contact-link">
                            <span className="icon">✉️</span> yeshaswi3@gmail.com
                        </a>
                        <a href="tel:7982344263" className="contact-link">
                            <span className="icon">📞</span> 7982344263
                        </a>
                        <div className="contact-location">
                            <span className="icon">📍</span> Dwarka Sector 3, Delhi
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;

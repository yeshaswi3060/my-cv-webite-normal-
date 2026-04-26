const Certifications = () => {
    const certifications = [
        {
            id: 'cert1',
            name: 'OxML Summer School',
            issuer: 'University of Oxford',
            year: '2025',
            accent: '#6366f1',
        },
        {
            id: 'cert2',
            name: 'CS50: Introduction to Computer Science',
            issuer: 'Harvard University',
            year: '2025',
            accent: '#6366f1',
        },
        {
            id: 'cert3',
            name: 'Certified Ethical Hacker (CEH)',
            issuer: 'EC-Council',
            year: '2025',
            accent: '#a855f7',
        },
        {
            id: 'cert5',
            name: 'Web Development Certification',
            issuer: 'W3Cx — World Wide Web Consortium',
            year: '2025',
            accent: '#6366f1',
        },
        {
            id: 'cert6',
            name: 'Frontend Developer Professional Certificate',
            issuer: 'Meta',
            year: '2025',
            accent: '#6366f1',
        },
        {
            id: 'cert7',
            name: 'Full Stack Developer Certification',
            issuer: 'freeCodeCamp',
            year: '2025',
            accent: '#a855f7',
        },
        {
            id: 'cert9',
            name: 'Internship Certificate',
            issuer: 'Connecting For',
            year: '2025',
            accent: '#6366f1',
        },
        {
            id: 'cert10',
            name: 'Internship Certificate',
            issuer: 'Gully Classes Foundation',
            year: '2025',
            accent: '#a855f7',
        },
        {
            id: 'cert8',
            name: 'Red Team Operations',
            issuer: 'Cybersecurity Institute',
            year: '2025',
            accent: '#a855f7',
        },
    ];

    return (
        <section id="certifications" className="section certifications-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Certifications</h2>
                    <div className="section-line"></div>
                </div>

                <div className="cert-grid">
                    {certifications.map((cert) => (
                        <div className="cert-card" key={cert.id} style={{ '--cert-accent': cert.accent }}>
                            <div className="cert-top-line"></div>
                            <div className="cert-inner">
                                <span className="cert-year">{cert.year}</span>
                                <h3 className="cert-title">{cert.name}</h3>
                                <p className="cert-issuer">{cert.issuer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certifications;

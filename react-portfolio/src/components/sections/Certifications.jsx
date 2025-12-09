import { useState } from 'react';

const Certifications = () => {
    const [modalImage, setModalImage] = useState(null);

    const certifications = [
        { id: 'cert1', image: '/Screenshot 2025-11-24 110747.png', name: 'OxML OXFORD' },
        { id: 'cert2', image: '/Screenshot 2025-11-24 111523.png', name: 'CS50 Harvard' },
        { id: 'cert3', image: '/certification3.jpg', name: 'UI/UX Design Vastu Shikhar' },
        { id: 'cert4', image: '/certification4.jpg', name: 'Frontend Developer-Mango Tree Technology' },
        { id: 'cert5', image: '/Screenshot 2025-11-26 130524.png', name: 'W3CLx' },
        { id: 'cert6', image: '/Screenshot 2025-11-26 131043.png', name: 'META Frontend Developer' },
        { id: 'cert7', image: '/Screenshot 2025-11-26 133013.png', name: 'FreeCodeCamp Full stack Developer' },
        { id: 'cert9', image: '/image.png', name: 'INTERNSHIP at Connecting For' },
        { id: 'cert10', image: '/image copy.png', name: 'INTERNSHIP at Connecting For' },
        { id: 'cert8', image: '/Screenshot 2025-11-26 133521.png', name: 'Red Team' },
    ];

    const openModal = (image) => {
        setModalImage(image);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalImage(null);
        document.body.style.overflow = 'auto';
    };

    // Close modal on Escape key
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };

    return (
        <>
            <section id="certifications" className="section certifications-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Certifications</h2>
                        <div className="section-line"></div>
                    </div>

                    <div className="certifications-grid">
                        {certifications.map((cert) => (
                            <div className="certification-card" key={cert.id}>
                                <div
                                    className="certification-image-wrapper"
                                    onClick={() => openModal(cert.image)}
                                >
                                    <img
                                        src={cert.image}
                                        alt={cert.name}
                                        className="certification-img"
                                    />
                                    <div className="certification-overlay">
                                        <span className="view-icon"></span>
                                    </div>
                                </div>
                                <h3 className="certification-name">{cert.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certification Modal */}
            {modalImage && (
                <div
                    id="certificationModal"
                    className="cert-modal"
                    onClick={closeModal}
                    onKeyDown={handleKeyDown}
                    style={{ display: 'block' }}
                >
                    <span className="cert-modal-close">&times;</span>
                    <img
                        className="cert-modal-content"
                        src={modalImage}
                        alt="Certificate"
                    />
                </div>
            )}
        </>
    );
};

export default Certifications;

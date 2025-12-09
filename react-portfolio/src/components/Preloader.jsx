import { useState, useEffect } from 'react';

const Preloader = () => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`preloader ${fadeOut ? 'fade-out' : ''}`} id="preloader">
            <div className="loader-content">
                <div className="loader-logo">Yeshaswi.</div>
                <div className="loader-progress-container">
                    <div className="loader-progress-bar"></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;

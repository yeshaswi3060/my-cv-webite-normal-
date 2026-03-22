import { useState } from 'react';
import { Link } from 'react-router-dom';

const AiDetection = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Reduce size if dimensions are very large
                    const MAX_DIM = 2048;
                    if (width > MAX_DIM || height > MAX_DIM) {
                        if (width > height) {
                            height *= MAX_DIM / width;
                            width = MAX_DIM;
                        } else {
                            width *= MAX_DIM / height;
                            height = MAX_DIM;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Re-encode as JPEG with balanced quality
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setError(null);
            setResult(null);
            setLoading(true);

            try {
                if (file.size > 5 * 1024 * 1024) {
                    // Auto-compress large images
                    const compressedData = await compressImage(file);
                    setPreview(compressedData);
                    setImage(file); // Keep original file ref for name etc.
                } else {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setPreview(reader.result);
                        setImage(file);
                    };
                    reader.readAsDataURL(file);
                }
            } catch (err) {
                console.error("Compression error:", err);
                setError("Failed to process image. Please try a different file.");
            } finally {
                setLoading(false);
            }
        }
    };

    const checkAiGeneration = async () => {
        if (!image) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Keep the prefix as it's often required by NIM APIs
            const imageToUpload = preview;

            // Use the local proxy to bypass CORS issues
            const response = await fetch("/api/nvidia/v1/cv/hive/ai-generated-image-detection", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_NVIDIA_API_KEY}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input: [imageToUpload]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `API request failed (Status: ${response.status})`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage += `: ${errorJson.detail || errorJson.message || errorText}`;
                } catch (e) {
                    errorMessage += `: ${errorText || "No detail provided"}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log("NVIDIA API Response:", data);
            
            // Extract score from the first item in the 'data' array
            let score = 0;
            if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
                const item = data.data[0];
                score = item.is_ai_generated || 0;
            } else if (Array.isArray(data) && data.length > 0) {
                // Fallback for direct array
                score = data[0].is_ai_generated || data[0].score || 0;
            }

            const isAi = score > 0.5;
            const displayConfidence = isAi ? score : (1 - score);

            setResult({
                isAi: isAi,
                confidence: (displayConfidence * 100).toFixed(2),
                raw: data
            });
        } catch (err) {
            console.error("Error checking AI generation:", err);
            if (err.message === "Failed to fetch") {
                setError("Failed to connect to NVIDIA API. This may be due to browser CORS restrictions with direct API calls. Please ensure your API key is valid and you have internet access.");
            } else {
                setError(err.message || "An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Icons
    const Icons = {
        Upload: () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
        ),
        Robot: () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <circle cx="12" cy="5" r="2"></circle>
                <path d="M12 7v4"></path>
                <line x1="8" y1="16" x2="8.01" y2="16"></line>
                <line x1="16" y1="16" x2="16.01" y2="16"></line>
            </svg>
        ),
        User: () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        ),
        Back: () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
        )
    };

    return (
        <div className="section ai-detection-page" style={{ paddingTop: 'calc(var(--header-height) + 40px)' }}>
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">AI Image Detector</h2>
                    <div className="section-line"></div>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '20px', maxWidth: '650px', fontSize: '1.1rem' }}>
                        Sophisticated analysis tool to identify AI-generated imagery. 
                        Powered by NVIDIA Build-Autogen-78 engine.
                    </p>
                </div>

                <div className="ai-detector-wrapper" style={{
                    background: 'var(--bg-surface)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '32px',
                    border: '1px solid var(--border-color)',
                    padding: 'clamp(24px, 5vw, 60px)',
                    display: 'grid',
                    gridTemplateColumns: preview ? 'repeat(auto-fit, minmax(350px, 1fr))' : '1fr',
                    gap: '40px',
                    alignItems: 'start',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    marginTop: '20px'
                }}>
                    <div className="upload-section">
                        <div 
                            className="dropzone" 
                            style={{
                                border: '2px dashed var(--border-color)',
                                borderRadius: '24px',
                                padding: '80px 40px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'var(--transition-smooth)',
                                background: 'rgba(255, 255, 255, 0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.03)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                            }}
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            <input 
                                type="file" 
                                id="file-input" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                style={{ display: 'none' }} 
                            />
                            <Icons.Upload />
                            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px', fontSize: '1.4rem' }}>
                                {image ? 'Replace Image' : 'Select Image'}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Drag and drop or click to browse
                            </p>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '12px' }}>
                                Supported: JPG, PNG, WebP (Max 5MB)
                            </p>
                        </div>

                        {preview && (
                            <button 
                                className="btn btn-primary" 
                                onClick={checkAiGeneration}
                                disabled={loading}
                                style={{ 
                                    width: '100%', 
                                    marginTop: '32px',
                                    height: '60px',
                                    fontSize: '1.1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner" style={{
                                            width: '20px',
                                            height: '20px',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: '#fff',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        <span>Analyzing...</span>
                                    </>
                                ) : 'Run Detection'}
                            </button>
                        )}
                        
                        {error && (
                            <div className="error-message" style={{ 
                                color: '#fda4af', 
                                marginTop: '24px', 
                                padding: '16px', 
                                background: 'rgba(225, 29, 72, 0.1)', 
                                border: '1px solid rgba(225, 29, 72, 0.2)',
                                borderRadius: '12px',
                                fontSize: '0.95rem',
                                lineHeight: '1.5'
                            }}>
                                <span style={{ marginRight: '8px' }}>⚠️</span> {error}
                            </div>
                        )}
                    </div>

                    {preview && (
                        <div className="result-section">
                            <div className="preview-container" style={{ position: 'relative' }}>
                                <div className="preview-frame" style={{
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    border: '1px solid var(--border-color)',
                                    background: '#000',
                                    aspectRatio: '16/10',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                
                                {result && (
                                    <div className="result-card" style={{
                                        marginTop: '24px',
                                        padding: '24px',
                                        background: result.isAi ? 'rgba(99, 102, 241, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                        border: `1px solid ${result.isAi ? 'rgba(99, 102, 241, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                                        borderRadius: '20px',
                                        animation: 'fadeUp 0.5s ease'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '12px',
                                                background: result.isAi ? 'var(--accent-primary)' : '#22c55e',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff'
                                            }}>
                                                {result.isAi ? <Icons.Robot /> : <Icons.User />}
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: '1.2rem', margin: '0', color: 'var(--text-primary)' }}>
                                                    {result.isAi ? 'AI Generated' : 'Human Created'}
                                                </h4>
                                                <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                    Classification Result
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="score-viz" style={{ marginTop: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                                <span>Confidence Level</span>
                                                <span style={{ fontWeight: '600' }}>{result.confidence}%</span>
                                            </div>
                                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ 
                                                    height: '100%', 
                                                    width: `${result.confidence}%`, 
                                                    background: result.isAi ? 'var(--accent-gradient)' : 'linear-gradient(to right, #22c55e, #4ade80)',
                                                    transition: 'width 1s ease-out'
                                                }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="back-navigation" style={{ marginTop: '60px' }}>
                    <Link to="/" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        <Icons.Back />
                        <span>Return to Portfolio</span>
                    </Link>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default AiDetection;

import React, { useState, useRef, useEffect } from 'react';

function CameraModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Check if we're on HTTPS or localhost for camera access
      const isSecure = window.location.protocol === 'https:' ||
                      window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname === '0.0.0.0';

      if (!isSecure) {
        setError('Camera access requires HTTPS. Please access the site via HTTPS or use localhost.');
        setIsLoading(false);
        return;
      }

      // Request camera permissions with better constraints
      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'environment' // Try to use back camera on mobile
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Ensure video plays
        videoRef.current.play().catch(e => {
          console.warn('Video play failed:', e);
        });
      }
    } catch (err) {
      console.error('Camera access error:', err);

      // Provide user-friendly error messages
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions in your browser and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is already in use by another application.');
      } else if (err.name === 'OverconstrainedError') {
        setError('Camera doesn\'t support the requested video quality. Trying with basic settings...');
        // Retry with basic constraints
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          setStream(basicStream);
          if (videoRef.current) {
            videoRef.current.srcObject = basicStream;
          }
        } catch (retryErr) {
          setError('Unable to access camera with basic settings. Please check your camera connection.');
        }
      } else {
        setError(`Camera error: ${err.message || 'Unknown error occurred'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      if (canvas.width === 0 || canvas.height === 0) {
        setError('Cannot capture - video not ready. Please wait a moment and try again.');
        return;
      }

      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);

      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      onCapture(imageData);
      stopCamera();
      onClose();
    } else {
      setError('Camera not ready. Please ensure camera is working and try again.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              📷 Camera - Capture Eco Action
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-0">
            {error ? (
              <div className="p-4 text-center">
                <div className="alert alert-warning">
                  <h6>⚠️ Camera Error</h6>
                  <p className="mb-3">{error}</p>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={startCamera}
                      disabled={isLoading}
                    >
                      {isLoading ? '🔄 Retrying...' : '🔄 Try Again'}
                    </button>
                    <button className="btn btn-secondary" onClick={onClose}>
                      Close
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-light rounded">
                  <h6>💡 Troubleshooting Tips:</h6>
                  <ul className="text-start small mb-0">
                    <li>• Ensure your browser supports camera access</li>
                    <li>• Allow camera permissions when prompted</li>
                    <li>• Close other applications using the camera</li>
                    <li>• Try refreshing the page and granting permissions again</li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <div className="position-relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-100"
                    style={{
                      maxHeight: '400px',
                      objectFit: 'cover',
                      backgroundColor: '#000'
                    }}
                  />
                  {isLoading && (
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading camera...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-light">
                  <div className="row g-2">
                    <div className="col-6">
                      <button
                        type="button"
                        className="btn btn-secondary w-100"
                        onClick={onClose}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="button"
                        className="btn btn-success w-100"
                        onClick={captureImage}
                        disabled={isLoading || !stream}
                      >
                        📸 {isLoading ? 'Loading...' : 'Capture Photo'}
                      </button>
                    </div>
                  </div>

                  {!stream && !isLoading && (
                    <div className="mt-2">
                      <button
                        className="btn btn-outline-primary w-100 btn-sm"
                        onClick={startCamera}
                      >
                        🔄 Retry Camera
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraModal;

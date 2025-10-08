import { useState } from 'react';
import './App.css';
import CameraModal from './CameraModal';

function App() {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleOpenCamera = (action: string) => {
    setLastAction(action);
    setCameraOpen(true);
  };

  const handleCapture = (imgData: string) => {
    setCapturedImage(imgData);
    setCameraOpen(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <h2>EcoMetrics Actions</h2>
      <button onClick={() => handleOpenCamera('plant-tree')} style={{ margin: 10 }}>
        Plant a Tree
      </button>
      <button onClick={() => handleOpenCamera('public-transport')} style={{ margin: 10 }}>
        Travelled by Public Transport
      </button>
      <CameraModal
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCapture}
      />
      {capturedImage && (
        <div style={{ marginTop: 20 }}>
          <h4>Captured Image ({lastAction === 'plant-tree' ? 'Plant a Tree' : 'Public Transport'})</h4>
          <img src={capturedImage} alt="Captured" style={{ width: 320, borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
}

export default App;

import { useState } from 'react';
import { analyzeImage } from './api/deepFakeApi';
import type { PredictionResponse } from './api/deepFakeApi';
import { ImageUploader } from './components/ImageUploader';
import { ResultCard } from './components/ResultCard';
import './index.css';

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    const response = await analyzeImage(selectedImage);
    setResult(response);
    setIsLoading(false);
  };

  // 🆕 NEW: The function to clear everything out
  const handleClear = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="logo">
          <span className="logo-icon">👁️</span>
          <div className="logo-text">
            <h1>Deepfake Detector</h1>
            <p className="subtitle">Upload an image to verify its authenticity.</p>
          </div>
        </div>

        <ImageUploader
          previewUrl={previewUrl}
          onImageSelected={handleImageSelected}
        />

        {/* 🆕 NEW: A wrapper to hold our buttons side-by-side */}
        <div className="button-group">
          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={!selectedImage || isLoading}
          >
            {isLoading ? 'Running Neural Network...' : 'Analyze Image'}
          </button>

          {selectedImage && (
            <button
              className="clear-btn"
              onClick={handleClear}
              disabled={isLoading}
            >
              Clear
            </button>
          )}
        </div>

        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { ArrowLeft, Upload, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DiseaseAnalysisResult {
  cropName: string;
}

export default function DiseasePrediction() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DiseaseAnalysisResult | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Please upload a JPEG, PNG, or WEBP file');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setSelectedImage(file);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('/api/disease-prediction', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze image');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Plant Disease Detection</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-64 object-contain rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div className="text-gray-600">
                    <span className="text-green-600 font-medium">Click to upload</span> or drag and drop
                    <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 2MB</p>
                  </div>
                </>
              )}
            </label>
          </div>

          <button
            type="submit"
            disabled={!selectedImage || loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
          >
            {loading ? (
              <div className="flex items-center">
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Analyzing Image...
              </div>
            ) : (
              'Detect Disease'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {analysis && (
          <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Analysis Result</h3>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-600 text-lg">{analysis.cropName}</p>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-6 text-center">
          Upload a clear image of the plant leaf or affected area for best results
        </p>
      </div>
    </div>
  );
} 
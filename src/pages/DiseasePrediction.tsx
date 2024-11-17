import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Upload, Loader } from 'lucide-react';

interface AnalysisResult {
  cropName: string;
  disease: string;
  treatment: string;
}

export default function DiseasePrediction() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setSelectedImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerConfetti = () => {
    // Implement confetti animation logic here
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
      const response = await fetch('http://localhost:3000/api/disease-prediction', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }

      const data = await response.json();
      setAnalysis(data);
      
    } catch (error: any) {
      console.error('Error details:', error);
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
          <h2 className="text-2xl font-bold">Crop Identification</h2>
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
                    <p className="text-sm text-gray-500">PNG, JPG up to 2MB</p>
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
                Identifying Plant...
              </div>
            ) : (
              'Identify Plant'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Service Notice
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {analysis && (
          <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Analysis Result</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900">Plant Identified</h4>
                <p className="text-gray-600 text-lg mt-2">{analysis.cropName}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900">Disease Status</h4>
                <p className="text-gray-600 text-lg mt-2">{analysis.disease}</p>
              </div>

              {analysis.treatment && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-900">Treatment Recommendations</h4>
                  <p className="text-gray-600 text-lg mt-2">{analysis.treatment}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
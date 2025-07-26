import React, { useState } from 'react';
import { Camera, Upload, Loader2, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import axios from 'axios';

interface DetectionResult {
  disease: string;
  duration: string;
  causative_agents: string[];
  untreated_result: string;
  preventive_measures: string[];
  treatment: string[];
}

const DiseaseDetection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [result, setResult] = useState<DetectionResult | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setImageFile(file);
        analyzeImage(file); // Auto-analyze after selection
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
        }
        return prev + 5;
      });
    }, 100);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://127.0.0.1:5000/predict-disease', formData);
      const data = res.data;
      setResult(data);
    } catch (error) {
      console.error('Prediction failed:', error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(100);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Upload or Capture Crop Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!selectedImage ? (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Upload or capture a clear image of affected crop leaves
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" className="relative">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </Button>
                  <Button variant="outline" className="relative">
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-muted">
                  <img
                    src={selectedImage}
                    alt="Uploaded crop"
                    className="w-full h-64 object-cover"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedImage(null);
                      setResult(null);
                      setAnalysisProgress(0);
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Loader */}
      {isAnalyzing && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <h3 className="font-semibold">Analyzing Image...</h3>
              <Progress value={analysisProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                AI is examining the crop image for disease symptoms
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Disease Analysis Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold">{result.disease}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Duration: {result.duration}
              </p>
              <div className="mt-2">
                <h5 className="font-medium mb-1">Causative Agents:</h5>
                <ul className="list-disc pl-5 text-sm">
                  {result.causative_agents.map((agent, idx) => (
                    <li key={idx}>{agent}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <h5 className="font-medium mb-1">If Untreated:</h5>
                <p className="text-sm text-red-700">{result.untreated_result}</p>
              </div>

              <div className="mt-4">
                <h5 className="font-medium mb-1">Preventive Measures:</h5>
                <ul className="list-disc pl-5 text-sm">
                  {result.preventive_measures.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <h5 className="font-medium mb-1">Treatment Suggestions:</h5>
                <ul className="list-disc pl-5 text-sm">
                  {result.treatment.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This result is based on AI analysis. Always confirm with a certified agricultural expert before applying treatment.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiseaseDetection;

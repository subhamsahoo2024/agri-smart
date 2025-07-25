import React, { useState } from 'react';
import { Camera, Upload, Loader2, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';

interface DetectionResult {
  disease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  treatment: string[];
  prevention: string[];
}

const DiseaseDetection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [result, setResult] = useState<DetectionResult | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          
          // Simulate analysis result
          setResult({
            disease: 'Leaf Blight',
            confidence: 87,
            severity: 'medium',
            treatment: [
              'Apply copper-based fungicide spray',
              'Remove affected leaves immediately',
              'Improve air circulation around plants',
              'Reduce watering frequency'
            ],
            prevention: [
              'Maintain proper plant spacing',
              'Avoid overhead watering',
              'Apply preventive fungicide during monsoon',
              'Ensure good drainage in field'
            ]
          });
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const recentDetections = [
    { disease: 'Bacterial Wilt', crop: 'Tomato', date: '2 days ago', severity: 'high' },
    { disease: 'Powdery Mildew', crop: 'Cucumber', date: '1 week ago', severity: 'low' },
    { disease: 'Root Rot', crop: 'Wheat', date: '2 weeks ago', severity: 'medium' }
  ];

  return (
    <div className="space-y-6">
      {/* Image Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Upload Crop Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!selectedImage ? (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Take a clear photo of affected crop leaves or upload from gallery
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
                    }}
                  >
                    Change Image
                  </Button>
                </div>
                
                {!result && !isAnalyzing && (
                  <Button 
                    onClick={analyzeImage}
                    className="w-full bg-gradient-primary hover:shadow-glow"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Analyze Disease
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Progress */}
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
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Disease Detected
              </span>
              <Badge className={getSeverityColor(result.severity)}>
                {result.severity.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">{result.disease}</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Confidence:</span>
                <Badge variant="outline">{result.confidence}%</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Recommended Treatment
                </h5>
                <ul className="space-y-2">
                  {result.treatment.map((treatment, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {treatment}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Prevention Tips
                </h5>
                <ul className="space-y-2">
                  {result.prevention.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-warning rounded-full mt-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Always consult with local agricultural experts before applying treatments. 
                This AI analysis should be used as a preliminary assessment.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Recent Detections */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Detections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDetections.map((detection, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{detection.disease}</p>
                  <p className="text-sm text-muted-foreground">
                    {detection.crop} • {detection.date}
                  </p>
                </div>
                <Badge className={getSeverityColor(detection.severity)}>
                  {detection.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiseaseDetection;
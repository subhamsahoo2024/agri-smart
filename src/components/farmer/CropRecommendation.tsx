import React, { useState } from 'react';
import { Thermometer, Droplets, FlaskConical, CloudRain, TrendingUp, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface CropData {
  name: string;
  icon: string;
  yield: string;
  profit: string;
  season: string;
  tips: string[];
  suitability: number;
}

interface FormData {
  temperature: string;
  humidity: string;
  ph: string;
  rainfall: string;
}

const CropRecommendation: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });
  const [recommendations, setRecommendations] = useState<CropData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const analyzeConditions = () => {
    if (!formData.temperature || !formData.humidity || !formData.ph || !formData.rainfall) {
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockRecommendations: CropData[] = [
        {
          name: 'Rice',
          icon: '🌾',
          yield: '45-60 quintals/hectare',
          profit: '₹35,000-50,000/hectare',
          season: 'Kharif',
          suitability: 95,
          tips: [
            'Ensure proper water management',
            'Use disease-resistant varieties',
            'Apply balanced fertilization'
          ]
        },
        {
          name: 'Wheat',
          icon: '🌾',
          yield: '40-55 quintals/hectare',
          profit: '₹30,000-45,000/hectare',
          season: 'Rabi',
          suitability: 87,
          tips: [
            'Timely sowing is crucial',
            'Monitor for rust diseases',
            'Use quality seeds'
          ]
        },
        {
          name: 'Sugarcane',
          icon: '🎋',
          yield: '700-900 quintals/hectare',
          profit: '₹80,000-120,000/hectare',
          season: 'Annual',
          suitability: 82,
          tips: [
            'Requires high water availability',
            'Regular pest monitoring needed',
            'Good market access essential'
          ]
        },
        {
          name: 'Cotton',
          icon: '🌿',
          yield: '15-25 quintals/hectare',
          profit: '₹40,000-65,000/hectare',
          season: 'Kharif',
          suitability: 78,
          tips: [
            'Monitor for bollworm',
            'Proper spacing important',
            'Quality cotton fetches better prices'
          ]
        }
      ];
      
      setRecommendations(mockRecommendations);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getSuitabilityColor = (score: number) => {
    if (score >= 90) return 'bg-success text-success-foreground';
    if (score >= 75) return 'bg-warning text-warning-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            Field Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature" className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-destructive" />
                Temperature (°C)
              </Label>
              <Input
                id="temperature"
                type="number"
                placeholder="25"
                value={formData.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="humidity" className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-secondary" />
                Humidity (%)
              </Label>
              <Input
                id="humidity"
                type="number"
                placeholder="65"
                value={formData.humidity}
                onChange={(e) => handleInputChange('humidity', e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ph" className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-accent" />
                Soil pH
              </Label>
              <Input
                id="ph"
                type="number"
                step="0.1"
                placeholder="6.5"
                value={formData.ph}
                onChange={(e) => handleInputChange('ph', e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rainfall" className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-primary" />
                Rainfall (mm)
              </Label>
              <Input
                id="rainfall"
                type="number"
                placeholder="800"
                value={formData.rainfall}
                onChange={(e) => handleInputChange('rainfall', e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          <Button
            onClick={analyzeConditions}
            disabled={isAnalyzing || !formData.temperature || !formData.humidity || !formData.ph || !formData.rainfall}
            className="w-full mt-6 h-12 bg-gradient-primary hover:shadow-glow"
          >
            {isAnalyzing ? (
              <>
                <FlaskConical className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Conditions...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Get Crop Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recommended Crops</h3>
          {recommendations.map((crop, index) => (
            <Card key={index} className="hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-2xl">
                      {crop.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{crop.name}</h4>
                      <p className="text-sm text-muted-foreground">{crop.season} Season</p>
                    </div>
                  </div>
                  <Badge className={getSuitabilityColor(crop.suitability)}>
                    {crop.suitability}% Match
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Expected Yield</p>
                    <p className="font-semibold text-primary">{crop.yield}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Profit Potential</p>
                    <p className="font-semibold text-success">{crop.profit}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Key Tips:</p>
                  <ul className="space-y-1">
                    {crop.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2 text-sm">
                        <Sprout className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Farming Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <Thermometer className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Temperature Range</p>
                <p className="text-xs text-muted-foreground">Most crops thrive between 20-30°C</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
              <Droplets className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Humidity Control</p>
                <p className="text-xs text-muted-foreground">60-70% humidity is optimal for most crops</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
              <FlaskConical className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium text-sm">Soil pH Balance</p>
                <p className="text-xs text-muted-foreground">6.0-7.5 pH range suits most agricultural crops</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CropRecommendation;
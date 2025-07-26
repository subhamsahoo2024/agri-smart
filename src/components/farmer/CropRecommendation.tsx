import React, { useState } from 'react';
import {
  Thermometer, Droplets, FlaskConical, CloudRain, TrendingUp, Sprout, MapPin
} from 'lucide-react';
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
  state: string;
  temperature: string;
  humidity: string;
  rainfall: string;
  ph: string;
}

const CropRecommendation: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    state: '',
    temperature: '',
    humidity: '',
    rainfall: '',
    ph: ''
  });

  const [recommendation, setRecommendation] = useState<CropData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weatherFetched, setWeatherFetched] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'state') {
      setWeatherFetched(false);  // Reset weather status on state change
    }
  };

  const fetchWeatherData = async (state: string) => {
    if (!state) return;
    try {
      const res = await fetch(`http://localhost:5000/weather?state=${encodeURIComponent(state)}`);
      const data = await res.json();
      console.log("Weather fetched:", data);

      setFormData(prev => ({
        ...prev,
        temperature: data.temperature.toFixed(2),
        humidity: data.humidity.toFixed(2),
        rainfall: data.rainfall.toFixed(2)
      }));
      setWeatherFetched(true);
    } catch (error) {
      console.error('Weather fetch failed', error);
      setWeatherFetched(false);
    }
  };

  const analyzeConditions = async () => {
    if (!formData.ph || !formData.temperature || !formData.humidity || !formData.rainfall) {
      alert("Please complete all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/recommend-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
          rainfall: parseFloat(formData.rainfall),
          ph: parseFloat(formData.ph)
        })
      });

      const crop = await res.json();
      console.log("Crop prediction:", crop);
      setRecommendation(crop);
    } catch (error) {
      console.error('Prediction failed', error);
      setRecommendation(null);
    }
    setIsLoading(false);
  };

  const getSuitabilityColor = (score: number) => {
    if (score >= 90) return 'bg-success text-success-foreground';
    if (score >= 75) return 'bg-warning text-warning-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            {t('Field Conditions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="state" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Enter State
              </Label>
              <Input
                id="state"
                type="text"
                placeholder="Tamil Nadu"
                value={formData.state}
                onBlur={() => fetchWeatherData(formData.state)}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-destructive" />
                Temperature (°C)
              </Label>
              <Input value={formData.temperature} readOnly className="h-12" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-secondary" />
                Humidity (%)
              </Label>
              <Input value={formData.humidity} readOnly className="h-12" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-primary" />
                Rainfall (mm)
              </Label>
              <Input value={formData.rainfall} readOnly className="h-12" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-accent" />
                Soil pH
              </Label>
              <Input
                type="number"
                step="0.1"
                placeholder="6.5"
                value={formData.ph}
                onChange={(e) => handleInputChange('ph', e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          <Button
            onClick={analyzeConditions}
            disabled={isLoading || !formData.ph || !weatherFetched}
            className="w-full mt-6 h-12 bg-gradient-primary hover:shadow-glow"
          >
            {isLoading ? (
              <>
                <FlaskConical className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Conditions...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Get Crop Recommendation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {recommendation && (
        <Card className="hover:shadow-medium transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-2xl">
                  {recommendation.icon || '🌿'}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{recommendation.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {recommendation.season || 'Season Info'} Season
                  </p>
                </div>
              </div>
              <Badge className={getSuitabilityColor(recommendation.suitability || 70)}>
                {recommendation.suitability || 70}% Match
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Expected Yield</p>
                <p className="font-semibold text-primary">{recommendation.yield || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Profit Potential</p>
                <p className="font-semibold text-success">{recommendation.profit || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Key Tips:</p>
              <ul className="space-y-1">
                {(recommendation.tips || []).map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Sprout className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CropRecommendation;

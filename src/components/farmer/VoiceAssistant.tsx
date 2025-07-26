import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const VoiceAssistant: React.FC = () => {
  const { t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        "Hello! I'm your AgriSmart voice assistant. You can ask me about crop prices, weather, government schemes, or farming tips.",
      timestamp: new Date(),
    },
  ]);

  // Yield Prediction form states
  const [showYieldForm, setShowYieldForm] = useState(false);
  const [stateInput, setStateInput] = useState('');
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [rainfall, setRainfall] = useState<number | null>(null);
  const [cropType, setCropType] = useState('');
  const [landSize, setLandSize] = useState<number | ''>('');
  const [loadingYield, setLoadingYield] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Quick actions - update yield prediction label & query
  const quickActions = [
    { label: 'Market Prices', icon: '💰', query: "What are today's market prices for wheat?" },
    { label: 'Weather Info', icon: '🌤️', query: "What's the weather forecast for farming?" },
    { label: 'Government Help', icon: '🏛️', query: 'Tell me about available government schemes for farmers' },
    { label: 'Yield Prediction', icon: '🌱', query: 'Predict crop yield' }, // changed query for clarity
  ];

  // Voice toggle logic (unchanged)
  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        addMessage('user', "What are the market prices for rice today?");
        setTimeout(() => {
          addMessage(
            'assistant',
            'Current rice prices in your area: Rs. 2,850 per quintal for common variety and Rs. 3,200 per quintal for premium variety. Prices have increased by 3% this week due to high demand.'
          );
        }, 1500);
        setIsListening(false);
      }, 3000);
    }
  };

  const addMessage = (type: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Quick action handler - opens form for yield prediction, else simulate response
  const handleQuickAction = (query: string) => {
    addMessage('user', query);

    if (query === 'Predict crop yield') {
      // Open the yield prediction form
      setShowYieldForm(true);
    } else {
      setTimeout(() => {
        addMessage('assistant', 'Let me help you with that information. Processing your request...');
      }, 1000);
    }
  };

  // Fetch weather when stateInput changes (debounced)
  useEffect(() => {
    if (stateInput.trim() === '') {
      setTemperature(null);
      setHumidity(null);
      setRainfall(null);
      setLoadingWeather(false);
      return;
    }

    const fetchWeather = async () => {
      setLoadingWeather(true);
      try {
        const res = await fetch(`/api/weather?state=${encodeURIComponent(stateInput.trim().toLowerCase())}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch weather data');

        setTemperature(data.temperature);
        setHumidity(data.humidity);
        setRainfall(data.rainfall);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setTemperature(null);
        setHumidity(null);
        setRainfall(null);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [stateInput]);

  // Submit yield prediction form
  const handleYieldPredict = async () => {
    if (
      !stateInput ||
      temperature === null ||
      humidity === null ||
      rainfall === null ||
      !cropType ||
      !landSize
    ) {
      alert('Please fill all fields and wait for weather data to load.');
      return;
    }

    if (loadingWeather) {
      alert('Weather data is still loading. Please wait a moment.');
      return;
    }

    setLoadingYield(true);

    try {
      const res = await fetch('/api/predict-yield', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: stateInput.trim().toLowerCase(),
          temperature,
          humidity,
          rainfall,
          crop_type: cropType.trim().toLowerCase(),
          land_size: Number(landSize),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Prediction failed');

      addMessage('assistant', `Predicted yield: ${data.predicted_yield} quintals.`);
      setShowYieldForm(false);

      // Reset form inputs
      setStateInput('');
      setCropType('');
      setLandSize('');
      setTemperature(null);
      setHumidity(null);
      setRainfall(null);
    } catch (err: any) {
      alert('Error predicting yield: ' + err.message);
    } finally {
      setLoadingYield(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Control Card */}
      <Card className="bg-gradient-primary text-primary-foreground shadow-glow">
        <CardContent className="p-6 text-center">
          <div className="relative inline-block mb-4">
            <Button
              size="lg"
              onClick={handleVoiceToggle}
              className={`w-20 h-20 rounded-full transition-all duration-300 ${
                isListening
                  ? 'bg-white/20 hover:bg-white/30 animate-pulse'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </Button>

            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-2 border-white/30 animate-ping" />
                <div className="absolute w-20 h-20 rounded-full border border-white/20 animate-pulse" />
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold mb-2">{isListening ? 'Listening...' : 'Tap to speak'}</h3>
          <p className="text-white/80 text-sm">
            {isListening
              ? 'Speak your question clearly in your language'
              : 'Ask about prices, weather, schemes, or farming tips'}
          </p>

          {isListening && (
            <div className="flex justify-center gap-1 mt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1 h-8 bg-white/60 rounded-full animate-wave"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Quick Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary"
                onClick={() => handleQuickAction(action.query)}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs font-medium text-center">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Yield Prediction Form */}
      {showYieldForm && (
        <Card>
          <CardHeader>
            <CardTitle>Yield Prediction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">State</label>
              <input
                type="text"
                value={stateInput}
                onChange={(e) => setStateInput(e.target.value)}
                placeholder="Enter your state"
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <p>Temperature: {loadingWeather ? 'Loading...' : temperature !== null ? `${temperature} °C` : 'Enter valid state'}</p>
              <p>Humidity: {loadingWeather ? 'Loading...' : humidity !== null ? `${humidity} %` : 'Enter valid state'}</p>
              <p>Rainfall: {loadingWeather ? 'Loading...' : rainfall !== null ? `${rainfall} mm` : 'Enter valid state'}</p>
            </div>

            <div>
              <label className="block mb-1 font-medium">Crop Type</label>
              <input
                type="text"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                placeholder="Enter crop type"
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Land Size (acres)</label>
              <input
                type="number"
                value={landSize}
                onChange={(e) => setLandSize(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Enter land size"
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <Button onClick={handleYieldPredict} disabled={loadingYield}>
              {loadingYield ? 'Predicting...' : 'Predict Yield'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowYieldForm(false);
                setStateInput('');
                setCropType('');
                setLandSize('');
                setTemperature(null);
                setHumidity(null);
                setRainfall(null);
              }}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Conversation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Conversation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.type === 'user' ? 'bg-primary text-primary-foreground ml-4' : 'bg-muted mr-4'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAssistant;

import React, { useState } from 'react';
import { Mic, Camera, Sprout, Building, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import VoiceAssistant from './VoiceAssistant';
import DiseaseDetection from './DiseaseDetection';
import CropRecommendation from './CropRecommendation';
import GovernmentSchemes from './GovernmentSchemes';

interface FarmerDashboardProps {
  userData: any;
  onLogout: () => void;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ userData, onLogout }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('voice');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/10 to-secondary-light/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">AgriSmart</h1>
              <p className="text-sm text-muted-foreground">Welcome, {userData.username || 'Farmer'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content with Bottom Tab Navigation */}
      <div className="pb-20"> {/* Space for bottom tab bar */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="p-4">
            <TabsContent value="voice" className="mt-0">
              <VoiceAssistant />
            </TabsContent>
            
            <TabsContent value="disease" className="mt-0">
              <DiseaseDetection />
            </TabsContent>
            
            <TabsContent value="crop" className="mt-0">
              <CropRecommendation />
            </TabsContent>
            
            <TabsContent value="schemes" className="mt-0">
              <GovernmentSchemes />
            </TabsContent>
          </div>

          {/* Bottom Tab Navigation - Mobile First */}
          <TabsList className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-sm border-t border-border/50 grid grid-cols-4 rounded-none shadow-large">
            <TabsTrigger 
              value="voice" 
              className="flex-col gap-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow"
            >
              <Mic className="w-5 h-5" />
              <span className="text-xs font-medium">{t('voice_assistant')}</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="disease" 
              className="flex-col gap-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow"
            >
              <Camera className="w-5 h-5" />
              <span className="text-xs font-medium">{t('disease_detection')}</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="crop" 
              className="flex-col gap-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow"
            >
              <Sprout className="w-5 h-5" />
              <span className="text-xs font-medium">{t('crop_recommendation')}</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="schemes" 
              className="flex-col gap-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow"
            >
              <Building className="w-5 h-5" />
              <span className="text-xs font-medium">{t('government_schemes')}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default FarmerDashboard;
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
  { code: 'raj', name: 'Rajasthani', nativeName: 'राजस्थानी' },
  { code: 'bh', name: 'Bhojpuri', nativeName: 'भोजपुरी' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' }
];

interface Translations {
  [key: string]: {
    [langCode: string]: string;
  };
}

const translations: Translations = {
  // Authentication
  'welcome': {
    'en': 'Welcome to AgriSmart',
    'hi': 'एग्रीस्मार्ट में आपका स्वागत है',
    'te': 'అగ్రిస్మార్ట్‌కు స్వాగతం',
    'ta': 'AgriSmart இல் வரவேற்கிறோம்',
    'bn': 'AgriSmart এ স্বাগতম'
  },
  'tagline': {
    'en': 'AI-Powered Agriculture Assistant',
    'hi': 'एआई-संचालित कृषि सहायक',
    'te': 'AI-శక్తితో కూడిన వ్యవసాయ సహాయకుడు',
    'ta': 'AI-இயங்கும் வேளாண்மை உதவியாளர்',
    'bn': 'AI-চালিত কৃষি সহায়ক'
  },
  'login': {
    'en': 'Login',
    'hi': 'लॉगिन',
    'te': 'లాగిన్',
    'ta': 'உள்நுழைவு',
    'bn': 'লগইন'
  },
  'signup': {
    'en': 'Sign Up',
    'hi': 'साइन अप',
    'te': 'సైన్ అప్',
    'ta': 'பதிவு செய்',
    'bn': 'সাইন আপ'
  },
  'username': {
    'en': 'Username',
    'hi': 'उपयोगकर्ता नाम',
    'te': 'వినియోగదారు పేరు',
    'ta': 'பயனர் பெயர்',
    'bn': 'ব্যবহারকারীর নাম'
  },
  'email_phone': {
    'en': 'Email or Phone',
    'hi': 'ईमेल या फोन',
    'te': 'ఇమెయిల్ లేదా ఫోన్',
    'ta': 'மின்னஞ்சல் அல்லது தொலைபேசி',
    'bn': 'ইমেইল বা ফোন'
  },
  'password': {
    'en': 'Password',
    'hi': 'पासवर्ड',
    'te': 'పాస్‌వర్డ్',
    'ta': 'கடவுச்சொல்',
    'bn': 'পাসওয়ার্ড'
  },
  'farmer': {
    'en': 'Farmer',
    'hi': 'किसान',
    'te': 'రైతు',
    'ta': 'விவசாயி',
    'bn': 'কৃষক'
  },
  'admin': {
    'en': 'Admin',
    'hi': 'प्रशासक',
    'te': 'అడ్మిన్',
    'ta': 'நிர்வாகி',
    'bn': 'অ্যাডমিন'
  },
  // Dashboard tabs
  'voice_assistant': {
    'en': 'Voice Assistant',
    'hi': 'वॉयस असिस्टेंट',
    'te': 'వాయిస్ అసిస్టెంట్',
    'ta': 'குரல் உதவியாளர்',
    'bn': 'ভয়েস সহায়ক'
  },
  'disease_detection': {
    'en': 'Disease Detection',
    'hi': 'रोग का पता लगाना',
    'te': 'వ్యాధి గుర్తింపు',
    'ta': 'நோய் கண்டறிதல்',
    'bn': 'রোগ সনাক্তকরণ'
  },
  'crop_recommendation': {
    'en': 'Crop Recommendation',
    'hi': 'फसल सिफारिश',
    'te': 'పంట సిఫార్సు',
    'ta': 'பயிர் பரிந்துரை',
    'bn': 'ফসল সুপারিশ'
  },
  'government_schemes': {
    'en': 'Government Schemes',
    'hi': 'सरकारी योजनाएं',
    'te': 'ప్రభుత్వ పథకాలు',
    'ta': 'அரசு திட்டங்கள்',
    'bn': 'সরকারি স্কিম'
  }
};

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  languages: Language[];
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  const t = (key: string): string => {
    return translations[key]?.[currentLanguage.code] || translations[key]?.['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, languages, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
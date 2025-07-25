import React, { useState } from 'react';
import { UserCheck, Sprout, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

interface AuthFormProps {
  onLogin: (role: 'farmer' | 'admin', userData: any) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('login');
  const [role, setRole] = useState<'farmer' | 'admin'>('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    emailPhone: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication - in real app, this would call Supabase
    onLogin(role, { ...formData, role });
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Floating particles background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-float" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/15 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Language selector */}
        <div className="flex justify-end mb-6">
          <LanguageSelector />
        </div>

        <Card className="border-none shadow-large bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {t('welcome')}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                {t('tagline')}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
                  {t('login')}
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
                  {t('signup')}
                </TabsTrigger>
              </TabsList>

              {/* Role Selection */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block">Select Role</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as 'farmer' | 'admin')} className="flex gap-4">
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value="farmer" id="farmer" />
                    <Label htmlFor="farmer" className="flex items-center gap-2 cursor-pointer flex-1 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <UserCheck className="w-4 h-4 text-primary" />
                      <span className="text-sm">{t('farmer')}</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="flex items-center gap-2 cursor-pointer flex-1 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <Shield className="w-4 h-4 text-secondary" />
                      <span className="text-sm">{t('admin')}</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <TabsContent value="login" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="emailPhone">{t('email_phone')}</Label>
                    <Input
                      id="emailPhone"
                      type="text"
                      placeholder={`${t('email_phone')}...`}
                      value={formData.emailPhone}
                      onChange={(e) => setFormData({ ...formData, emailPhone: e.target.value })}
                      className="h-12 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('password')}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={`${t('password')}...`}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="h-12 text-base pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t('username')}</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder={`${t('username')}...`}
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="h-12 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailPhoneSignup">{t('email_phone')}</Label>
                    <Input
                      id="emailPhoneSignup"
                      type="text"
                      placeholder={`${t('email_phone')}...`}
                      value={formData.emailPhone}
                      onChange={(e) => setFormData({ ...formData, emailPhone: e.target.value })}
                      className="h-12 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordSignup">{t('password')}</Label>
                    <div className="relative">
                      <Input
                        id="passwordSignup"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={`${t('password')}...`}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="h-12 text-base pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  {activeTab === 'login' ? t('login') : t('signup')}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
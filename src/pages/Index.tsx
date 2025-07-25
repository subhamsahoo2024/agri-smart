import React, { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AuthForm from '@/components/auth/AuthForm';
import FarmerDashboard from '@/components/farmer/FarmerDashboard';
import AdminDashboard from '@/components/admin/AdminDashboard';

interface User {
  role: 'farmer' | 'admin';
  username: string;
  emailPhone: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: 'farmer' | 'admin', userData: any) => {
    setUser({ role, ...userData });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <LanguageProvider>
      {!user ? (
        <AuthForm onLogin={handleLogin} />
      ) : user.role === 'farmer' ? (
        <FarmerDashboard userData={user} onLogout={handleLogout} />
      ) : (
        <AdminDashboard userData={user} onLogout={handleLogout} />
      )}
    </LanguageProvider>
  );
};

export default Index;

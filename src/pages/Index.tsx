import React, { useState, useEffect } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AuthForm from '@/components/auth/AuthForm';
import FarmerDashboard from '@/components/farmer/FarmerDashboard';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  role: 'farmer' | 'admin';
  username: string;
  emailPhone: string;
  user: SupabaseUser;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user role from user_roles table
          const { data: userRole, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
            
          if (!error && userRole) {
            setUser({
              role: userRole.role as 'farmer' | 'admin',
              username: session.user.user_metadata?.username || '',
              emailPhone: session.user.email || '',
              user: session.user
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Trigger the auth state change manually for initial load
        setTimeout(async () => {
          const { data: userRole, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
            
          if (!error && userRole) {
            setUser({
              role: userRole.role as 'farmer' | 'admin',
              username: session.user.user_metadata?.username || '',
              emailPhone: session.user.email || '',
              user: session.user
            });
          }
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (role: 'farmer' | 'admin', userData: any) => {
    setUser({ role, ...userData });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

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

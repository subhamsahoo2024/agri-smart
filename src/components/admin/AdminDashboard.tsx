import React from 'react';
import { Users, Camera, MessageSquare, Building, TrendingUp, Download, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

interface AdminDashboardProps {
  userData: any;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userData, onLogout }) => {
  const { t } = useLanguage();

  const stats = [
    {
      title: 'Total Farmers',
      value: '12,847',
      change: '+342 this month',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Disease Uploads',
      value: '3,256',
      change: '+89 today',
      icon: Camera,
      color: 'text-secondary'
    },
    {
      title: 'Voice Queries',
      value: '8,421',
      change: '+156 today',
      icon: MessageSquare,
      color: 'text-accent'
    },
    {
      title: 'Active Schemes',
      value: '47',
      change: '3 ending soon',
      icon: Building,
      color: 'text-earth'
    }
  ];

  const recentActivity = [
    {
      type: 'disease',
      description: 'Farmer Rajesh uploaded crop image for disease detection',
      location: 'Maharashtra',
      time: '2 minutes ago',
      status: 'processed'
    },
    {
      type: 'voice',
      description: 'Voice query about wheat market prices',
      location: 'Punjab',
      time: '5 minutes ago',
      status: 'processed'
    },
    {
      type: 'scheme',
      description: 'New farmer registered for PM-KISAN scheme',
      location: 'Uttar Pradesh',
      time: '12 minutes ago',
      status: 'approved'
    },
    {
      type: 'crop',
      description: 'Crop recommendation requested for rice cultivation',
      location: 'West Bengal',
      time: '18 minutes ago',
      status: 'processed'
    }
  ];

  const topQueries = [
    { query: 'Market prices for wheat', count: 234 },
    { query: 'Weather forecast', count: 187 },
    { query: 'Government loan schemes', count: 156 },
    { query: 'Fertilizer recommendations', count: 143 },
    { query: 'Crop insurance details', count: 98 }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'disease': return Camera;
      case 'voice': return MessageSquare;
      case 'scheme': return Building;
      case 'crop': return TrendingUp;
      default: return Users;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-success text-success-foreground';
      case 'approved': return 'bg-primary text-primary-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary-light/10 to-primary-light/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center shadow-medium">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">AgriSmart Admin</h1>
              <p className="text-sm text-muted-foreground">Welcome, {userData.username || 'Admin'}</p>
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

      <div className="p-4 space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-secondary text-secondary-foreground shadow-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome, Admin {userData.username || 'Ramesh'}!
                </h2>
                <p className="text-white/90">
                  Monitor and manage the AgriSmart platform from your dashboard
                </p>
              </div>
              <TrendingUp className="w-16 h-16 text-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-medium transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-xs text-success mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="h-16 bg-gradient-primary hover:shadow-glow">
            <Plus className="w-5 h-5 mr-2" />
            Add New Scheme
          </Button>
          <Button variant="outline" className="h-16 border-secondary text-secondary hover:bg-secondary/5">
            <Download className="w-5 h-5 mr-2" />
            Export Reports
          </Button>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">{activity.location}</p>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Queries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Voice Queries This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topQueries.map((query, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium">{query.query}</p>
                  </div>
                  <Badge variant="outline">{query.count} times</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Disease Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Success Rate</span>
                  <span className="font-semibold text-success">94.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Response Time</span>
                  <span className="font-semibold">2.3s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Most Detected</span>
                  <span className="font-semibold">Leaf Blight</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Voice Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Accuracy Rate</span>
                  <span className="font-semibold text-success">91.8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Languages Used</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Peak Hours</span>
                  <span className="font-semibold">8-10 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
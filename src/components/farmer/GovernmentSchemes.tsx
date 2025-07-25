import React, { useState } from 'react';
import { Building, Heart, Filter, Search, MapPin, Calendar, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

interface Scheme {
  id: string;
  name: string;
  type: 'Central' | 'State';
  category: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  deadline: string;
  applicationLink: string;
  isBookmarked: boolean;
}

const GovernmentSchemes: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState<Set<string>>(new Set());

  const schemes: Scheme[] = [
    {
      id: '1',
      name: 'PM-KISAN Samman Nidhi',
      type: 'Central',
      category: 'Direct Benefit',
      description: 'Income support scheme providing ₹6,000 per year to farmer families',
      eligibility: [
        'Small and marginal farmers',
        'Land holding up to 2 hectares',
        'Valid Aadhaar card required'
      ],
      benefits: [
        '₹2,000 every 4 months',
        'Direct bank transfer',
        'No state government interference'
      ],
      deadline: '31 Dec 2024',
      applicationLink: '#',
      isBookmarked: false
    },
    {
      id: '2',
      name: 'Pradhan Mantri Fasal Bima Yojana',
      type: 'Central',
      category: 'Insurance',
      description: 'Crop insurance scheme providing financial support against crop loss',
      eligibility: [
        'All farmers growing notified crops',
        'Tenant farmers eligible',
        'Premium amount as per crop and area'
      ],
      benefits: [
        'Coverage for all stages of crop cycle',
        'Use of technology for quick settlement',
        'Low premium rates'
      ],
      deadline: '30 Nov 2024',
      applicationLink: '#',
      isBookmarked: false
    },
    {
      id: '3',
      name: 'Kisan Credit Card',
      type: 'Central',
      category: 'Credit',
      description: 'Credit facility for farmers to meet their cultivation and other needs',
      eligibility: [
        'All farmers including tenant farmers',
        'Valid land documents',
        'No collateral required up to ₹1.6 lakh'
      ],
      benefits: [
        'Simple documentation',
        'Flexible repayment',
        'Insurance coverage'
      ],
      deadline: 'Ongoing',
      applicationLink: '#',
      isBookmarked: false
    },
    {
      id: '4',
      name: 'Soil Health Card Scheme',
      type: 'Central',
      category: 'Soil Testing',
      description: 'Provides soil health cards to farmers with nutrient status of their soil',
      eligibility: [
        'All farmers',
        'Land holding documents required',
        'Free of cost'
      ],
      benefits: [
        'Free soil testing',
        'Nutrient recommendations',
        'Improved crop productivity'
      ],
      deadline: 'Ongoing',
      applicationLink: '#',
      isBookmarked: false
    },
    {
      id: '5',
      name: 'Organic Farming Scheme',
      type: 'State',
      category: 'Organic',
      description: 'Support for farmers adopting organic farming practices',
      eligibility: [
        'Farmers willing to adopt organic practices',
        'Minimum 5 acres of land',
        'Group certification preferred'
      ],
      benefits: [
        'Subsidy on organic inputs',
        'Certification support',
        'Market linkage assistance'
      ],
      deadline: '15 Jan 2025',
      applicationLink: '#',
      isBookmarked: false
    }
  ];

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'bookmarked') return matchesSearch && bookmarkedSchemes.has(scheme.id);
    return matchesSearch && scheme.type.toLowerCase() === activeFilter;
  });

  const toggleBookmark = (schemeId: string) => {
    const newBookmarks = new Set(bookmarkedSchemes);
    if (newBookmarks.has(schemeId)) {
      newBookmarks.delete(schemeId);
    } else {
      newBookmarks.add(schemeId);
    }
    setBookmarkedSchemes(newBookmarks);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'direct benefit': return 'bg-success text-success-foreground';
      case 'insurance': return 'bg-secondary text-secondary-foreground';
      case 'credit': return 'bg-accent text-accent-foreground';
      case 'soil testing': return 'bg-earth text-earth-foreground';
      case 'organic': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search schemes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            <Tabs value={activeFilter} onValueChange={setActiveFilter}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="central">Central</TabsTrigger>
                <TabsTrigger value="state">State</TabsTrigger>
                <TabsTrigger value="bookmarked">
                  <Heart className="w-4 h-4 mr-1" />
                  Saved
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Building className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{schemes.length}</p>
            <p className="text-sm text-muted-foreground">Total Schemes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p className="text-2xl font-bold">{bookmarkedSchemes.size}</p>
            <p className="text-sm text-muted-foreground">Bookmarked</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Ending Soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id} className="hover:shadow-medium transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{scheme.name}</CardTitle>
                    <Badge variant={scheme.type === 'Central' ? 'default' : 'secondary'}>
                      {scheme.type}
                    </Badge>
                  </div>
                  <Badge className={getCategoryColor(scheme.category)}>
                    {scheme.category}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleBookmark(scheme.id)}
                  className="shrink-0"
                >
                  {bookmarkedSchemes.has(scheme.id) ? (
                    <BookmarkCheck className="w-4 h-4 text-destructive" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{scheme.description}</p>
              
              <div className="grid gap-3">
                <div>
                  <h5 className="text-sm font-medium mb-2">Eligibility:</h5>
                  <ul className="space-y-1">
                    {scheme.eligibility.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs">
                        <span className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium mb-2">Benefits:</h5>
                  <ul className="space-y-1">
                    {scheme.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs">
                        <span className="w-1 h-1 bg-success rounded-full mt-1.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Deadline:</span>
                  <span className={scheme.deadline.includes('2024') ? 'text-warning font-medium' : 'text-foreground'}>
                    {scheme.deadline}
                  </span>
                </div>
                
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No schemes found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GovernmentSchemes;
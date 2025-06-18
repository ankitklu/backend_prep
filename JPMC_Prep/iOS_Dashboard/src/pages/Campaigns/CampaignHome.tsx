import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, Map, Users, Target, Home } from 'lucide-react';
import CampaignForm from './CampaignForm';
import CampaignList from './CampaignList';
import CampaignDetails from './CampaignDetails';
import Dashboard from './Dashboard';

interface Campaign {
  _id: string;
  name: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  goal: {
    type: string;
    target: number;
    unit: string;
  };
  location: {
    center: { lat: number; lng: number };
    radius: number;
  };
  resources: Array<{ name: string; required: number; distributed: number }>;
  volunteersRequired: number;
  partners: string[];
  progress: {
    value: number;
    updatedAt: string;
  };
  contact: {
    name: string;
    phone: string;
    email: string;
  };
}

const CampaignHome = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setActiveTab('details');
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setActiveTab('create');
  };

  const handleBackToDashboard = () => {
    setSelectedCampaign(null);
    setEditingCampaign(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-4">
            NGO Campaign Manager
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empower your organization with comprehensive campaign management, 
            geographical targeting, and real-time progress tracking
          </p>
        </div>

        {/* Main Content */}
        {selectedCampaign ? (
          <CampaignDetails 
            campaign={selectedCampaign} 
            onBack={handleBackToDashboard}
          />
        ) : (
          <>
            {/* Feature Cards - Only show on home tab */}
            {activeTab === 'home' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardHeader className="text-center">
                    <Target className="h-12 w-12 mx-auto text-blue-600 mb-2" />
                    <CardTitle className="text-lg text-blue-800">Goal Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-700 text-center">
                      Set and monitor campaign objectives with visual progress indicators
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100">
                  <CardHeader className="text-center">
                    <Map className="h-12 w-12 mx-auto text-green-600 mb-2" />
                    <CardTitle className="text-lg text-green-800">Geo Targeting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-700 text-center">
                      Define coverage areas with interactive maps and radius selection
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardHeader className="text-center">
                    <Users className="h-12 w-12 mx-auto text-purple-600 mb-2" />
                    <CardTitle className="text-lg text-purple-800">Team Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-purple-700 text-center">
                      Coordinate volunteers and manage partner organizations effectively
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100">
                  <CardHeader className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-orange-600 mb-2" />
                    <CardTitle className="text-lg text-orange-800">Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-orange-700 text-center">
                      Comprehensive reporting and data visualization for insights
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="home" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="campaigns" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Campaigns
                </TabsTrigger>
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create
                </TabsTrigger>
              </TabsList>

              <TabsContent value="home" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-2xl">Welcome to NGO Campaign Manager</CardTitle>
                    <CardDescription className="text-center text-lg">
                      Your comprehensive solution for managing and tracking NGO campaigns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-6">
                    <p className="text-muted-foreground max-w-3xl mx-auto">
                      Our platform provides powerful tools for creating, managing, and tracking NGO campaigns with 
                      geographical targeting, resource management, volunteer coordination, and real-time analytics. 
                      Get started by exploring our features or creating your first campaign.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        onClick={() => setActiveTab('dashboard')} 
                        size="lg" 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <BarChart3 className="h-5 w-5 mr-2" />
                        View Analytics
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('create')} 
                        size="lg" 
                        variant="outline"
                        className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Create Campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dashboard" className="space-y-6">
                <Dashboard />
              </TabsContent>

              <TabsContent value="campaigns" className="space-y-6">
                <CampaignList 
                  onViewDetails={handleViewDetails}
                  onEditCampaign={handleEditCampaign}
                />
              </TabsContent>

              <TabsContent value="create" className="space-y-6">
                <CampaignForm />
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Footer */}
        <div className="mt-16 text-center py-8 border-t">
          <p className="text-muted-foreground">
            Built with ❤️ for NGOs making a difference in the world
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignHome;
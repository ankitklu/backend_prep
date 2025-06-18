import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MapPin, Target, Users, Package } from "lucide-react";
import CampaignForm from "./CampaignForm";
import CampaignList from "./CampaignList";
import CampaignDashboard from "./CampaignDashboard";
import type { Campaign } from "../types";

const CampaignHome = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreateCampaign = (campaign: Campaign) => {
    setCampaigns([...campaigns, { ...campaign, id: Date.now().toString() }]);
    setShowForm(false);
  };

  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            NGO Campaign Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage and track your social impact campaigns effectively
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{campaigns.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <MapPin className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {campaigns.filter(c => new Date(c.endDate) > new Date()).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {campaigns.reduce((sum, c) => sum + c.volunteersRequired, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resources Needed</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {campaigns.reduce((sum, c) => sum + c.resources.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">Campaign Management</CardTitle>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="campaigns">All Campaigns</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Welcome to Campaign Management</h3>
                  <p className="text-gray-600 mb-6">
                    Create, manage, and track your NGO campaigns with powerful tools for geographical targeting and progress monitoring.
                  </p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Campaign
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="campaigns">
                <CampaignList 
                  campaigns={campaigns} 
                  onSelectCampaign={handleSelectCampaign}
                  onUpdateCampaigns={setCampaigns}
                />
              </TabsContent>
              
              <TabsContent value="dashboard">
                {selectedCampaign ? (
                  <CampaignDashboard campaign={selectedCampaign} />
                ) : (
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Select a Campaign</h3>
                    <p className="text-gray-600">
                      Choose a campaign from the campaigns tab to view its detailed dashboard.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Campaign Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CampaignForm 
                onSubmit={handleCreateCampaign}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignHome;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Users, 
  Calendar, 
  Target, 
  Phone, 
  Mail, 
  Building2,
  Package,
  TrendingUp,
  ArrowLeft,
  Save
} from 'lucide-react';
import { format } from 'date-fns';
import GoalTracker from './GoalTracker';
import ResourceManager from './ResourceManager';

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

interface CampaignDetailsProps {
  campaign: Campaign;
  onBack: () => void;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaign, onBack }) => {
  const [currentCampaign, setCurrentCampaign] = useState<Campaign>(campaign);
  const [progressValue, setProgressValue] = useState(campaign.progress?.value || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProgress = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:5001/api/campaigns/${campaign._id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: progressValue }),
      });

      if (response.ok) {
        setCurrentCampaign(prev => ({
          ...prev,
          progress: {
            value: progressValue,
            updatedAt: new Date().toISOString()
          }
        }));
        alert("Progress updated successfully!");
      }
    } catch (error) {
      alert("Error updating progress: " + error);
    } finally {
      setIsUpdating(false);
    }
  };

  const addResource = async (resource: { name: string; required: number; distributed: number }) => {
    try {
      const response = await fetch(`http://localhost:5001/api/campaigns/${campaign._id}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resource),
      });

      if (response.ok) {
        const updatedCampaign = await response.json();
        setCurrentCampaign(updatedCampaign);
        alert("Resource added successfully!");
      }
    } catch (error) {
      alert("Error adding resource: " + error);
    }
  };

  const progressPercentage = ((currentCampaign.progress?.value || 0) / currentCampaign.goal.target) * 100;

  const getStatusColor = (type: string) => {
    const colors = {
      'fundraising': 'bg-green-100 text-green-800',
      'awareness': 'bg-blue-100 text-blue-800',
      'health-checkup': 'bg-red-100 text-red-800',
      'relief-distribution': 'bg-orange-100 text-orange-800',
      'education': 'bg-purple-100 text-purple-800',
      'environment': 'bg-emerald-100 text-emerald-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{currentCampaign.name}</h1>
          <p className="text-muted-foreground">Campaign Details & Analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Campaign Overview */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Campaign Overview
                </CardTitle>
                <Badge className={getStatusColor(currentCampaign.type)}>
                  {currentCampaign.type.replace('-', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{currentCampaign.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-semibold">{format(new Date(currentCampaign.startDate), 'MMM dd, yyyy')}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Calendar className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-semibold">{format(new Date(currentCampaign.endDate), 'MMM dd, yyyy')}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Users className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                  <p className="text-sm text-muted-foreground">Volunteers</p>
                  <p className="font-semibold">{currentCampaign.volunteersRequired}</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <MapPin className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                  <p className="text-sm text-muted-foreground">Coverage</p>
                  <p className="font-semibold">{currentCampaign.location.radius}km</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goal Tracker */}
          <GoalTracker 
            goal={currentCampaign.goal}
            progress={currentCampaign.progress}
          />

          {/* Resource Manager */}
          <ResourceManager 
            resources={currentCampaign.resources}
            onAddResource={addResource}
          />

          {/* Map View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Coverage Area
              </CardTitle>
              <CardDescription>
                Campaign coverage area with {currentCampaign.location.radius}km radius
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Interactive map would be displayed here</p>
                  <p className="text-sm text-gray-400">
                    Center: {currentCampaign.location.center.lat.toFixed(4)}, {currentCampaign.location.center.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Progress Update */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Update Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="progress">Current Progress</Label>
                <Input
                  id="progress"
                  type="number"
                  value={progressValue}
                  onChange={(e) => setProgressValue(Number(e.target.value))}
                  placeholder="Enter current progress"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progressValue} / {currentCampaign.goal.target} {currentCampaign.goal.unit}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <Button 
                onClick={updateProgress} 
                disabled={isUpdating}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdating ? "Updating..." : "Update Progress"}
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{currentCampaign.contact.name}</p>
                  <p className="text-sm text-muted-foreground">Campaign Coordinator</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p>{currentCampaign.contact.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p>{currentCampaign.contact.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Partners */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Partner Organizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentCampaign.partners.filter(partner => partner.trim()).map((partner, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{partner}</span>
                  </div>
                ))}
                {currentCampaign.partners.filter(partner => partner.trim()).length === 0 && (
                  <p className="text-sm text-muted-foreground">No partners added yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Campaign Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Days Active</span>
                <span className="font-medium">
                  {Math.ceil((new Date().getTime() - new Date(currentCampaign.startDate).getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Resources Types</span>
                <span className="font-medium">{currentCampaign.resources.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Partner Count</span>
                <span className="font-medium">{currentCampaign.partners.filter(p => p.trim()).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;

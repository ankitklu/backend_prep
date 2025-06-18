import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Users, Calendar, Target, Eye, Edit, Trash2, Download } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

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

interface CampaignListProps {
  onViewDetails: (campaign: Campaign) => void;
  onEditCampaign: (campaign: Campaign) => void;
}

const CampaignList: React.FC<CampaignListProps> = ({ onViewDetails, onEditCampaign }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/campaigns');
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      alert("Error fetching campaigns: " + error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/campaigns/${id}`, {
        method: 'DELETE',
      });
      setCampaigns(campaigns.filter(campaign => campaign._id !== id));
      alert("Campaign deleted successfully!");
    } catch (error) {
      alert("Error deleting campaign: " + error);
    }
  };

  const exportToExcel = () => {
    const exportData = campaigns.map(campaign => ({
      'Campaign Name': campaign.name,
      'Type': campaign.type,
      'Description': campaign.description,
      'Start Date': format(new Date(campaign.startDate), 'dd/MM/yyyy'),
      'End Date': format(new Date(campaign.endDate), 'dd/MM/yyyy'),
      'Goal Type': campaign.goal.type,
      'Target': campaign.goal.target,
      'Unit': campaign.goal.unit,
      'Progress': campaign.progress?.value || 0,
      'Volunteers Required': campaign.volunteersRequired,
      'Coverage Radius (km)': campaign.location.radius,
      'Contact Person': campaign.contact.name,
      'Contact Phone': campaign.contact.phone,
      'Contact Email': campaign.contact.email,
      'Partners': campaign.partners.join(', '),
      'Resources': campaign.resources.map(r => `${r.name}: ${r.distributed}/${r.required}`).join('; ')
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Campaigns');
    XLSX.writeFile(workbook, 'NGO_Campaigns_Export.xlsx');
    
    alert("Campaigns exported to Excel successfully!");
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Campaign Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">Manage and track all your campaigns</p>
        </div>
        <Button onClick={exportToExcel} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Campaigns Yet</h3>
            <p className="text-muted-foreground">Create your first campaign to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign._id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{campaign.name}</CardTitle>
                  <Badge className={getStatusColor(campaign.type)}>
                    {campaign.type.replace('-', ' ')}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {campaign.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {campaign.progress?.value || 0} / {campaign.goal.target} {campaign.goal.unit}
                    </span>
                  </div>
                  <Progress 
                    value={((campaign.progress?.value || 0) / campaign.goal.target) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(campaign.startDate),  'MMM dd')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{campaign.volunteersRequired} volunteers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{campaign.location.radius}km radius</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>{campaign.goal.type}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewDetails(campaign)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditCampaign(campaign)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteCampaign(campaign._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignList;

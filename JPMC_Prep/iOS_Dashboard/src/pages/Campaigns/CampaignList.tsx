import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Target, 
  Eye, 
  Edit, 
  Trash2,
  Phone,
  Mail
} from "lucide-react";
import type { Campaign } from "../types";

interface CampaignListProps {
  campaigns: Campaign[];
  onSelectCampaign: (campaign: Campaign) => void;
  onUpdateCampaigns: (campaigns: Campaign[]) => void;
}

const CampaignList = ({ campaigns, onSelectCampaign, onUpdateCampaigns }: CampaignListProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getStatusColor = (campaign: Campaign) => {
    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);

    if (now < start) return "bg-yellow-100 text-yellow-800";
    if (now > end) return "bg-gray-100 text-gray-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusText = (campaign: Campaign) => {
    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);

    if (now < start) return "Upcoming";
    if (now > end) return "Completed";
    return "Active";
  };

  const calculateProgress = (campaign: Campaign) => {
    if (campaign.goal.target === 0) return 0;
    return Math.min((campaign.progress.value / campaign.goal.target) * 100, 100);
  };

  const deleteCampaign = (id: string) => {
    const updatedCampaigns = campaigns.filter(c => c.id !== id);
    onUpdateCampaigns(updatedCampaigns);
  };

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Campaigns Yet</h3>
        <p className="text-gray-600">
          Create your first campaign to get started with managing your social impact initiatives.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Campaigns ({campaigns.length})</h3>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <Card 
            key={campaign.id} 
            className={`transition-all hover:shadow-lg ${
              selectedId === campaign.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{campaign.name}</CardTitle>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getStatusColor(campaign)}>
                      {getStatusText(campaign)}
                    </Badge>
                    <Badge variant="outline">{campaign.type}</Badge>
                    <Badge variant="secondary">{campaign.goal.type}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedId(campaign.id || null);
                      onSelectCampaign(campaign);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCampaign(campaign.id!)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-600">{campaign.description}</p>

              {/* Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">
                    {campaign.progress.value} / {campaign.goal.target} {campaign.goal.unit}
                  </span>
                </div>
                <Progress value={calculateProgress(campaign)} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">
                  {calculateProgress(campaign).toFixed(1)}% complete
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Duration</div>
                    <div className="text-sm font-medium">
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-xs text-gray-500">Coverage</div>
                    <div className="text-sm font-medium">{campaign.location.radius}km radius</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="text-xs text-gray-500">Volunteers</div>
                    <div className="text-sm font-medium">{campaign.volunteersRequired}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  <div>
                    <div className="text-xs text-gray-500">Resources</div>
                    <div className="text-sm font-medium">{campaign.resources.length} items</div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t pt-4">
                <div className="text-sm font-medium mb-2">Contact Information</div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {campaign.contact.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {campaign.contact.email}
                  </div>
                </div>
              </div>

              {/* Partners */}
              {campaign.partners.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Partners</div>
                  <div className="flex flex-wrap gap-2">
                    {campaign.partners.map((partner, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {partner}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources Summary */}
              {campaign.resources.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Resources Required</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {campaign.resources.slice(0, 6).map((resource, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded">
                        <div className="font-medium">{resource.name}</div>
                        <div className="text-gray-600">
                          {resource.distributed}/{resource.required} units
                        </div>
                      </div>
                    ))}
                    {campaign.resources.length > 6 && (
                      <div className="bg-gray-50 p-2 rounded text-center text-gray-500">
                        +{campaign.resources.length - 6} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;

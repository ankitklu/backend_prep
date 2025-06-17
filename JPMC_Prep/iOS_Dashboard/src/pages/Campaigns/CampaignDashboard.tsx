import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  Target, 
  Users, 
  MapPin, 
  Calendar,
  TrendingUp,
  Package,
  Phone,
  Mail
} from "lucide-react";
import type { Campaign } from "../types"

interface CampaignDashboardProps {
  campaign: Campaign;
}

const CampaignDashboard = ({ campaign }: CampaignDashboardProps) => {
  const calculateProgress = () => {
    if (campaign.goal.target === 0) return 0;
    return Math.min((campaign.progress.value / campaign.goal.target) * 100, 100);
  };

  const getDaysRemaining = () => {
    const end = new Date(campaign.endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = () => {
    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);

    if (now < start) return "bg-yellow-100 text-yellow-800";
    if (now > end) return "bg-gray-100 text-gray-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusText = () => {
    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);

    if (now < start) return "Upcoming";
    if (now > end) return "Completed";
    return "Active";
  };

  // Mock data for charts
  const progressData = [
    { week: 'Week 1', achieved: 20 },
    { week: 'Week 2', achieved: 45 },
    { week: 'Week 3', achieved: 70 },
    { week: 'Week 4', achieved: campaign.progress.value },
  ];

  const resourceData = campaign.resources.map(resource => ({
    name: resource.name,
    required: resource.required,
    distributed: resource.distributed,
    remaining: resource.required - resource.distributed
  }));

  const pieData = [
    { name: 'Completed', value: campaign.progress.value, color: '#22c55e' },
    { name: 'Remaining', value: campaign.goal.target - campaign.progress.value, color: '#e5e7eb' }
  ];

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">{campaign.name}</h2>
          <div className="flex gap-2">
            <Badge className={getStatusColor()}>{getStatusText()}</Badge>
            <Badge variant="outline">{campaign.type}</Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {calculateProgress().toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {campaign.progress.value}
            </div>
            <p className="text-xs text-muted-foreground">
              of {campaign.goal.target} {campaign.goal.unit}
            </p>
            <Progress value={calculateProgress()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getDaysRemaining()}
            </div>
            <p className="text-xs text-muted-foreground">
              Until {new Date(campaign.endDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {campaign.volunteersRequired}
            </div>
            <p className="text-xs text-muted-foreground">Required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Area</CardTitle>
            <MapPin className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {campaign.location.radius}km
            </div>
            <p className="text-xs text-muted-foreground">Radius</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="achieved" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Goal Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goal Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <div className="text-2xl font-bold">
                {campaign.progress.value}/{campaign.goal.target}
              </div>
              <div className="text-sm text-gray-600">{campaign.goal.unit}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Resource Distribution Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={resourceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="distributed" stackId="a" fill="#22c55e" name="Distributed" />
              <Bar dataKey="remaining" stackId="a" fill="#e5e7eb" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Details */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-gray-600">{campaign.description}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Timeline</h4>
              <div className="text-sm text-gray-600">
                <div>Start: {new Date(campaign.startDate).toLocaleDateString()}</div>
                <div>End: {new Date(campaign.endDate).toLocaleDateString()}</div>
              </div>
            </div>

            {campaign.partners.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Partner Organizations</h4>
                <div className="flex flex-wrap gap-2">
                  {campaign.partners.map((partner, index) => (
                    <Badge key={index} variant="outline">{partner}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact & Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Contact Person</h4>
              <div className="space-y-1 text-sm">
                <div className="font-medium">{campaign.contact.name}</div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  {campaign.contact.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  {campaign.contact.email}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Resource Requirements</h4>
              <div className="space-y-2">
                {campaign.resources.map((resource, index) => (
                  <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                    <span>{resource.name}</span>
                    <span className="font-medium">
                      {resource.distributed}/{resource.required}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDashboard;
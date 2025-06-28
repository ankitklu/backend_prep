import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Target, MapPin, TrendingUp, Calendar } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  campaignsByType: Array<{ _id: string; count: number }>;
  totalVolunteersNeeded: number;
}

interface Campaign {
  _id: string;
  name: string;
  type: string;
  progress: { value: number };
  goal: { target: number; unit: string };
  volunteersRequired: number;
  startDate: string;
  endDate: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, campaignsResponse] = await Promise.all([
        fetch('http://localhost:5001/api/campaigns/stats'),
        fetch('http://localhost:5001/api/campaigns')
      ]);

      const statsData = await statsResponse.json();
      const campaignsData = await campaignsResponse.json();

      setStats(statsData);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Chart data preparation
  const campaignTypeData = {
    labels: stats?.campaignsByType.map(item => 
      item._id.charAt(0).toUpperCase() + item._id.slice(1).replace('-', ' ')
    ) || [],
    datasets: [
      {
        label: 'Campaigns',
        data: stats?.campaignsByType.map(item => item.count) || [],
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green
          '#F59E0B', // Yellow
          '#EF4444', // Red
          '#8B5CF6', // Purple
          '#06B6D4', // Cyan
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const progressData = {
    labels: campaigns.slice(0, 6).map(campaign => campaign.name.substring(0, 20) + '...'),
    datasets: [
      {
        label: 'Progress (%)',
        data: campaigns.slice(0, 6).map(campaign => 
          ((campaign.progress?.value || 0) / campaign.goal.target) * 100
        ),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const volunteersData = {
    labels: campaigns.slice(0, 6).map(campaign => campaign.name.substring(0, 15) + '...'),
    datasets: [
      {
        label: 'Volunteers Required',
        data: campaigns.slice(0, 6).map(campaign => campaign.volunteersRequired),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    cutout: '60%',
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-8">
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{stats?.totalCampaigns || 0}</div>
            <p className="text-xs text-blue-600">All time campaigns</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{stats?.activeCampaigns || 0}</div>
            <p className="text-xs text-green-600">Currently running</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{stats?.completedCampaigns || 0}</div>
            <p className="text-xs text-purple-600">Successfully finished</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Volunteers Needed</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{stats?.totalVolunteersNeeded || 0}</div>
            <p className="text-xs text-orange-600">Across all campaigns</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Campaign Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Campaign Types Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of campaigns by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Doughnut data={campaignTypeData} options={doughnutOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Campaign Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Campaign Progress Overview
            </CardTitle>
            <CardDescription>
              Progress percentage for recent campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar data={progressData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Requirements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Volunteer Requirements Trend
            </CardTitle>
            <CardDescription>
              Number of volunteers required across campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line data={volunteersData} options={lineOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaign Activity</CardTitle>
          <CardDescription>Latest updates from your campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.slice(0, 5).map((campaign, index) => {
              const progressPercentage = ((campaign.progress?.value || 0) / campaign.goal.target) * 100;
              return (
                <div key={campaign._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      progressPercentage >= 100 ? 'bg-green-500' :
                      progressPercentage >= 50 ? 'bg-blue-500' : 'bg-orange-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {campaign.type.replace('-', ' ')} • {campaign.volunteersRequired} volunteers needed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{progressPercentage.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">
                      {campaign.progress?.value || 0} / {campaign.goal.target} {campaign.goal.unit}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
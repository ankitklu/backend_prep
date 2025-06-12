import { useState } from "react"
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  ImageIcon,
  Video,
  FileImage,
  Music,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Settings,
  UserCog,
  Shield,
  Key,
  Bell,
  Mail,
  MessageSquare,
  FileText,
  PieChart,
  Activity,
  Briefcase,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const Dashboard = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const navigationItems = [
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      color: "bg-blue-500",
      subItems: [
        { label: "Employee Analytics", icon: Users },
        { label: "Money Analytics", icon: DollarSign },
        { label: "Revenue", icon: TrendingUp },
        { label: "Performance", icon: Activity },
      ],
    },
    {
      id: "media",
      label: "Media",
      icon: ImageIcon,
      color: "bg-purple-500",
      subItems: [
        { label: "Images", icon: FileImage },
        { label: "Videos", icon: Video },
        { label: "Audio", icon: Music },
        { label: "Documents", icon: FileText },
      ],
    },
    {
      id: "meetings",
      label: "Meetings",
      icon: Calendar,
      color: "bg-green-500",
      subItems: [
        { label: "Schedule", icon: Clock },
        { label: "Locations", icon: MapPin },
        { label: "Calls", icon: Phone },
        { label: "Messages", icon: MessageSquare },
      ],
    },
    {
      id: "admin",
      label: "Admin",
      icon: Settings,
      color: "bg-orange-500",
      subItems: [
        { label: "User Management", icon: UserCog },
        { label: "Security", icon: Shield },
        { label: "Permissions", icon: Key },
        { label: "System Settings", icon: Settings },
      ],
    },
    {
      id: "communications",
      label: "Communications",
      icon: Mail,
      color: "bg-red-500",
      subItems: [
        { label: "Email", icon: Mail },
        { label: "Notifications", icon: Bell },
        { label: "Chat", icon: MessageSquare },
        { label: "Announcements", icon: Briefcase },
      ],
    },
  ]

  const statsCards = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+180.1%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: "12,234",
      change: "+19%",
      icon: Briefcase,
      color: "text-purple-600",
    },
    {
      title: "Growth Rate",
      value: "89%",
      change: "+201%",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="min-h-screen w-[100%] bg-gradient-to-br from-green-50 to-red-100 pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, Administrator</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Online
              </Badge>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[100%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-green-600 font-medium">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Recent Activity</CardTitle>
              <CardDescription>Your latest dashboard activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New user registered</p>
                      <p className="text-xs text-gray-500">{item} minutes ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Quick Actions</CardTitle>
              <CardDescription>Frequently used actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Users, label: "Add User", color: "bg-blue-500" },
                  { icon: FileText, label: "Reports", color: "bg-green-500" },
                  { icon: Settings, label: "Settings", color: "bg-orange-500" },
                  { icon: PieChart, label: "Analytics", color: "bg-purple-500" },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-200 hover:scale-105"
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center mb-2`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* iOS-style Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="bg-transparent backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-2">            
            <div className="flex justify-around items-end relative">
              {navigationItems.map((item) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Sub-menu */}
                  {hoveredItem === item.id && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 p-2 min-w-48 animate-in slide-in-from-bottom-2 duration-200">
                      <div className="grid grid-cols-1 gap-1">
                        {item.subItems.map((subItem, index) => (
                          <button
                            key={index}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100/50 transition-colors text-left w-full"
                          >
                            <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>
                              <subItem.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{subItem.label}</span>
                          </button>
                        ))}
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"></div>
                    </div>
                  )}

                  {/* Main navigation item */}
                  <button className="flex flex-col items-center space-y-1 p-3 rounded-xl hover:bg-gray-100/50 transition-all duration-200 hover:scale-110 group">
                    <div
                      className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{item.label}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

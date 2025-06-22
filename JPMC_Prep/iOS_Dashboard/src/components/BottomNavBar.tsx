import { Home, BarChart3, ImageIcon, Calendar, Settings, Mail, MapPin, Megaphone, MonitorPlay } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function BottomNavBar() {
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="bg-transparent backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-2">
          <div className="flex justify-around items-end relative">
            {/* Home Button */}
            <button
              className="flex flex-col items-center space-y-1 p-3 rounded-xl hover:bg-gray-100/50 transition-all duration-200 hover:scale-110 group"
              onClick={() => navigate("/dashboard")}
            >
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">Home</span>
            </button>
            {/* Analytics Button */}
            <button
              className="flex flex-col items-center space-y-1 p-3 rounded-xl hover:bg-gray-100/50 transition-all duration-200 hover:scale-110 group"
              onClick={() => navigate("/analytics")}
            >
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">Analytics</span>
            </button>
            {/* Media Button */}
            <button
              className="flex flex-col items-center space-y-1 p-3 rounded-xl hover:bg-gray-100/50 transition-all duration-200 hover:scale-110 group"
              onClick={()=> navigate("/post-generator")}
            >
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">Media</span>
            </button>
            {/* Meetings Button */}
            <button
              className="flex flex-col items-center space-y-1 p-3 rounded-xl hover:bg-gray-100/50 transition-all duration-200 hover:scale-110 group"
              onClick={() => navigate("/meetings")}
            >
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">Meetings</span>
            </button>
            {/* Admin Button */}
            <button
              className="flex flex-col items-center space-y-1 p-3 rounded-xl hover:bg-gray-100/50 transition-all duration-200 hover:scale-110 group"
              onClick={() => navigate("/admin")}
            >
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">Admin</span>
            </button>
            {/* Communications Button */}
            <button
              className="flex flex-col items-center space-y-1 p-3 rounded-xl hover:bg-gray-100/50 transition-all duration-200 hover:scale-110 group"
              onClick={() => navigate("/communications")}
            >
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">Communications</span>
            </button>
            {/* Locations Button (extra) */}
            <button
              className="flex flex-col items-center space-y-1 p-3 rounded-xl hover:bg-gray-100/50 transition-all duration-200 hover:scale-110 group"
              onClick={() => navigate("/location-form")}
            >
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">Locations</span>
            </button>

            {/* Campaigns Button */}
            <button
              className="flex flex-col items-center space-y-1 p-3 rounded-xl hover:bg-gray-100/50 transition-all duration-200 hover:scale-110 group"
              onClick={() => navigate("/campaigns")}
            >
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">Campaigns</span>
            </button>

            {/* LMS Button */}
            <button
              className="flex flex-col items-center space-y-1 p-3 rounded-xl hover:bg-gray-100/50 transition-all duration-200 hover:scale-110 group"
              onClick={() => navigate("/lms")}
            >
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <MonitorPlay className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">LMS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Calendar, MessageSquare, Clock, Plus } from "lucide-react"
import CalendarComponent from "./CalendarComponent"
import MeetingForm from "./MeetingForm"
import MessageCenter from "./MessageCenter"
import PastMeetings from "./PastMeetings"
import type { Meeting } from "../types"

const MeetingsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"calendar" | "messages" | "past">("calendar")
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [showMeetingForm, setShowMeetingForm] = useState(false)

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/meetings")
      const data = await response.json()
      setMeetings(data)
    } catch (error) {
      console.error("Error fetching meetings:", error)
    }
  }

  const handleMeetingCreated = () => {
    fetchMeetings()
    setShowMeetingForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div className="min-h-screen p-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Meetings Dashboard
          </h1>
          <p className="text-gray-300">Manage meetings, send communications, and track your schedule</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-1">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === "calendar"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === "messages"
                ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === "past"
                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>Past Meetings</span>
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          {activeTab === "calendar" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Schedule Meeting</h2>
                <button
                  onClick={() => setShowMeetingForm(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Meeting</span>
                </button>
              </div>
              <CalendarComponent meetings={meetings} />
              {showMeetingForm && (
                <MeetingForm onClose={() => setShowMeetingForm(false)} onMeetingCreated={handleMeetingCreated} />
              )}
            </div>
          )}

          {activeTab === "messages" && <MessageCenter meetings={meetings} />}

          {activeTab === "past" && <PastMeetings meetings={meetings} />}
        </div>
      </div>
    </div>
    </div>
  )
}

export default MeetingsDashboard

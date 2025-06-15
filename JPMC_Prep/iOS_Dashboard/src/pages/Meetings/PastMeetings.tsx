"use client"

import type React from "react"
import { useState } from "react"
import { Clock, Users, Calendar, Search, Filter } from "lucide-react"
import type { Meeting } from "../types"

interface PastMeetingsProps {
  meetings: Meeting[]
}

const PastMeetings: React.FC<PastMeetingsProps> = ({ meetings }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDate, setFilterDate] = useState("")

  const now = new Date()
  const pastMeetings = meetings.filter((meeting) => new Date(meeting.date) < now)

  const filteredMeetings = pastMeetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !filterDate || meeting.date.startsWith(filterDate)
    return matchesSearch && matchesDate
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-semibold text-white">Past Meetings</h2>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search meetings..."
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No past meetings found</p>
          </div>
        ) : (
          filteredMeetings.map((meeting) => (
            <div
              key={meeting._id}
              className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{meeting.title}</h3>
                  <p className="text-gray-300 mb-3">{meeting.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-purple-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(meeting.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{meeting.duration} minutes</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{meeting.participants.length} participants</span>
                </div>
                <div className="flex -space-x-2">
                  {meeting.participants.slice(0, 3).map((participant, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-slate-800"
                    >
                      {participant.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {meeting.participants.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium border-2 border-slate-800">
                      +{meeting.participants.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PastMeetings

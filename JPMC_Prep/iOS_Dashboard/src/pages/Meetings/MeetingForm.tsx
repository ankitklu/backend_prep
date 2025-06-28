"use client"

import type React from "react"
import { useState } from "react"
import { X, Calendar, Clock, Users, FileText } from "lucide-react"

interface MeetingFormProps {
  onClose: () => void
  onMeetingCreated: () => void
}

const MeetingForm: React.FC<MeetingFormProps> = ({ onClose, onMeetingCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 60,
    participants: [""],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5001/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          date: `${formData.date}T${formData.time}`,
          participants: formData.participants.filter((p) => p.trim() !== ""),
        }),
      })

      if (response.ok) {
        onMeetingCreated()
      }
    } catch (error) {
      console.error("Error creating meeting:", error)
    }
  }

  const addParticipant = () => {
    setFormData((prev) => ({
      ...prev,
      participants: [...prev.participants, ""],
    }))
  }

  const updateParticipant = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((p, i) => (i === index ? value : p)),
    }))
  }

  const removeParticipant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white">Schedule New Meeting</h3>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Meeting Title</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter meeting title"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              placeholder="Meeting description (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Time</span>
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) }))}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="15"
              step="15"
            />
          </div>

          <div>
            <label className="block text-white mb-2 flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Participants</span>
            </label>
            {formData.participants.map((participant, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="email"
                  value={participant}
                  onChange={(e) => updateParticipant(index, e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="participant@example.com"
                />
                {formData.participants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="px-3 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addParticipant}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Add Participant
            </button>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Schedule Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MeetingForm

"use client"

import type React from "react"
import { useState } from "react"
import { Send, MessageSquare, Mail, Users, FileText } from "lucide-react"
import type { Meeting } from "../types"

interface MessageCenterProps {
  meetings: Meeting[]
}

const MessageCenter: React.FC<MessageCenterProps> = ({ meetings }) => {
  const [messageData, setMessageData] = useState({
    type: "announcement" as "invitation" | "announcement",
    meetingId: "",
    recipients: [""],
    subject: "",
    message: "",
    channels: {
      email: true,
      whatsapp: false,
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5001/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...messageData,
          recipients: messageData.recipients.filter((r) => r.trim() !== ""),
        }),
      })

      if (response.ok) {
        alert("Messages sent successfully!")
        setMessageData({
          type: "announcement",
          meetingId: "",
          recipients: [""],
          subject: "",
          message: "",
          channels: { email: true, whatsapp: false },
        })
      }
    } catch (error) {
      console.error("Error sending messages:", error)
    }
  }

  const addRecipient = () => {
    setMessageData((prev) => ({
      ...prev,
      recipients: [...prev.recipients, ""],
    }))
  }

  const updateRecipient = (index: number, value: string) => {
    setMessageData((prev) => ({
      ...prev,
      recipients: prev.recipients.map((r, i) => (i === index ? value : r)),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare className="w-6 h-6 text-green-400" />
        <h2 className="text-2xl font-semibold text-white">Message Center</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Message Type */}
        <div>
          <label className="block text-white mb-3">Message Type</label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setMessageData((prev) => ({ ...prev, type: "invitation" }))}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                messageData.type === "invitation"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Meeting Invitation
            </button>
            <button
              type="button"
              onClick={() => setMessageData((prev) => ({ ...prev, type: "announcement" }))}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                messageData.type === "announcement"
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Announcement
            </button>
          </div>
        </div>

        {/* Meeting Selection (for invitations) */}
        {messageData.type === "invitation" && (
          <div>
            <label className="block text-white mb-2">Select Meeting</label>
            <select
              value={messageData.meetingId}
              onChange={(e) => setMessageData((prev) => ({ ...prev, meetingId: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a meeting</option>
              {meetings.map((meeting) => (
                <option key={meeting._id} value={meeting._id} className="bg-slate-800">
                  {meeting.title} - {new Date(meeting.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Recipients */}
        <div>
          <label className="block text-white mb-2 flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Recipients</span>
          </label>
          {messageData.recipients.map((recipient, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={recipient}
                onChange={(e) => updateRecipient(index, e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email or phone number"
              />
            </div>
          ))}
          <button type="button" onClick={addRecipient} className="text-blue-400 hover:text-blue-300 transition-colors">
            + Add Recipient
          </button>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-white mb-2 flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Subject</span>
          </label>
          <input
            type="text"
            value={messageData.subject}
            onChange={(e) => setMessageData((prev) => ({ ...prev, subject: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Message subject"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-white mb-2">Message</label>
          <textarea
            value={messageData.message}
            onChange={(e) => setMessageData((prev) => ({ ...prev, message: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
            placeholder="Type your message here..."
            required
          />
        </div>

        {/* Channels */}
        <div>
          <label className="block text-white mb-3">Send via</label>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={messageData.channels.email}
                onChange={(e) =>
                  setMessageData((prev) => ({
                    ...prev,
                    channels: { ...prev.channels, email: e.target.checked },
                  }))
                }
                className="w-5 h-5 rounded bg-white/10 border border-white/20 text-blue-500 focus:ring-blue-500"
              />
              <Mail className="w-5 h-5 text-blue-400" />
              <span className="text-white">Email</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={messageData.channels.whatsapp}
                onChange={(e) =>
                  setMessageData((prev) => ({
                    ...prev,
                    channels: { ...prev.channels, whatsapp: e.target.checked },
                  }))
                }
                className="w-5 h-5 rounded bg-white/10 border border-white/20 text-green-500 focus:ring-green-500"
              />
              <MessageSquare className="w-5 h-5 text-green-400" />
              <span className="text-white">WhatsApp</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-4 rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
        >
          <Send className="w-5 h-5" />
          <span>Send Messages</span>
        </button>
      </form>
    </div>
  )
}

export default MessageCenter

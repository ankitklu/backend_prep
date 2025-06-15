"use client"

import type React from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Meeting } from "../types"

interface CalendarComponentProps {
  meetings: Meeting[]
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ meetings }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getMeetingsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return meetings.filter((meeting) => meeting.date.startsWith(dateStr))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h3 className="text-xl font-semibold text-white">
          {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <button
          onClick={() => navigateMonth("next")}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-gray-400 font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map((day) => (
          <div key={`empty-${day}`} className="h-24"></div>
        ))}
        {days.map((day) => {
          const dayMeetings = getMeetingsForDate(day)
          return (
            <div
              key={day}
              className="h-24 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="text-white font-medium mb-1">{day}</div>
              {dayMeetings.slice(0, 2).map((meeting, index) => (
                <div key={meeting._id} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded mb-1 truncate">
                  {meeting.title}
                </div>
              ))}
              {dayMeetings.length > 2 && <div className="text-xs text-gray-400">+{dayMeetings.length - 2} more</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarComponent

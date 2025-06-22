import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProgressStats, User, Video } from "../types"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface UserAnalyticsProps {
  stats: ProgressStats | null
  users: User[]
  videos: Video[]
}

export function UserAnalytics({ stats, users, videos }: UserAnalyticsProps) {
  const completionChartRef = useRef<HTMLCanvasElement>(null)
  const topicChartRef = useRef<HTMLCanvasElement>(null)
  const userProgressChartRef = useRef<HTMLCanvasElement>(null)
  const completionChart = useRef<Chart | null>(null)
  const topicChart = useRef<Chart | null>(null)
  const userProgressChart = useRef<Chart | null>(null)

  useEffect(() => {
    if (!stats) return

    // Cleanup existing charts
    if (completionChart.current) {
      completionChart.current.destroy()
    }
    if (topicChart.current) {
      topicChart.current.destroy()
    }
    if (userProgressChart.current) {
      userProgressChart.current.destroy()
    }

    // Completion Rate Doughnut Chart
    if (completionChartRef.current) {
      const ctx = completionChartRef.current.getContext("2d")
      if (ctx) {
        completionChart.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Completed", "Pending"],
            datasets: [
              {
                data: [stats.completionRate, 100 - stats.completionRate],
                backgroundColor: ["#10B981", "#E5E7EB"],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          },
        })
      }
    }

    // Topic Progress Bar Chart
    if (topicChartRef.current && stats.topicProgress.length > 0) {
      const ctx = topicChartRef.current.getContext("2d")
      if (ctx) {
        topicChart.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: stats.topicProgress.map((tp) => tp.topic),
            datasets: [
              {
                label: "Completed",
                data: stats.topicProgress.map((tp) => tp.completed),
                backgroundColor: "#10B981",
              },
              {
                label: "Total",
                data: stats.topicProgress.map((tp) => tp.total),
                backgroundColor: "#E5E7EB",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                position: "top",
              },
            },
          },
        })
      }
    }

    // User Progress Line Chart
    if (userProgressChartRef.current && stats.userProgress.length > 0) {
      const ctx = userProgressChartRef.current.getContext("2d")
      if (ctx) {
        userProgressChart.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: stats.userProgress.map((up) => up.userName),
            datasets: [
              {
                label: "Videos Completed",
                data: stats.userProgress.map((up) => up.completedVideos),
                borderColor: "#3B82F6",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                position: "top",
              },
            },
          },
        })
      }
    }

    return () => {
      if (completionChart.current) completionChart.current.destroy()
      if (topicChart.current) topicChart.current.destroy()
      if (userProgressChart.current) userProgressChart.current.destroy()
    }
  }, [stats])

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-lg text-gray-600">Loading analytics...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Learning Analytics Dashboard</CardTitle>
          <CardDescription>Track user progress and learning completion rates</CardDescription>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Learners</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{stats.totalVideos}</div>
            <div className="text-sm text-gray-600">Total Videos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">{stats.completionRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">{stats.averageScore.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Completion Rate</CardTitle>
            <CardDescription>Percentage of completed vs pending videos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <canvas ref={completionChartRef}></canvas>
            </div>
          </CardContent>
        </Card>

        {/* Topic Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Progress by Topic</CardTitle>
            <CardDescription>Completion status across different topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <canvas ref={topicChartRef}></canvas>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Individual User Progress</CardTitle>
          <CardDescription>Number of videos completed by each user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <canvas ref={userProgressChartRef}></canvas>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Users with highest completion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Videos Completed</th>
                  <th className="text-left p-2">Total Score</th>
                  <th className="text-left p-2">Location</th>
                </tr>
              </thead>
              <tbody>
                {stats.userProgress.slice(0, 10).map((progress, index) => {
                  const user = users.find((u) => u.name === progress.userName)
                  return (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{progress.userName}</td>
                      <td className="p-2">{progress.completedVideos}</td>
                      <td className="p-2">{progress.totalScore}</td>
                      <td className="p-2">{user?.location || "N/A"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

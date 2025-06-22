import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoManager } from "./VideoManager"
import { TopicManager } from "./TopicManager"
import { UserAnalytics } from "./UserAnalytics"
import { VideoPlayer } from "./VideoPlayer"
import type { Video, Topic, User, ProgressStats } from "../types"
import { Play, Users, BookOpen, TrendingUp } from "lucide-react"

const API_BASE = "http://localhost:5000/api"

export function LmsDashboard() {
  const [videos, setVideos] = useState<Video[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch all data
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [videosRes, topicsRes, usersRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/videos`),
        fetch(`${API_BASE}/topics`),
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/progress/stats`),
      ])

      const [videosData, topicsData, usersData, statsData] = await Promise.all([
        videosRes.json(),
        topicsRes.json(),
        usersRes.json(),
        statsRes.json(),
      ])

      setVideos(videosData)
      setTopics(topicsData)
      setUsers(usersData)
      setStats(statsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoUpdate = () => {
    fetchAllData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading LMS Dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Management System</h1>
          <p className="text-gray-600 mt-2">Manage videos, topics, and track user progress</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videos.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Topics</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topics.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats ? `${stats.completionRate.toFixed(1)}%` : "0%"}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="videos">Video Management</TabsTrigger>
            <TabsTrigger value="topics">Topic Management</TabsTrigger>
            <TabsTrigger value="analytics">User Analytics</TabsTrigger>
            <TabsTrigger value="player">Video Player</TabsTrigger>
          </TabsList>

          <TabsContent value="videos">
            <VideoManager videos={videos} topics={topics} onUpdate={handleVideoUpdate} />
          </TabsContent>

          <TabsContent value="topics">
            <TopicManager topics={topics} videos={videos} onUpdate={handleVideoUpdate} />
          </TabsContent>

          <TabsContent value="analytics">
            <UserAnalytics stats={stats} users={users} videos={videos} />
          </TabsContent>

          <TabsContent value="player">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video Player & Quiz</CardTitle>
                  <CardDescription>Select a video to play and test the quiz functionality</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <select
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => {
                        const video = videos.find((v) => v._id === e.target.value)
                        setSelectedVideo(video || null)
                      }}
                      value={selectedVideo?._id || ""}
                    >
                      <option value="">Select a video...</option>
                      {videos.map((video) => (
                        <option key={video._id} value={video._id}>
                          {video.title} ({video.language})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedVideo && <VideoPlayer video={selectedVideo} userId="demo-user-id" />}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

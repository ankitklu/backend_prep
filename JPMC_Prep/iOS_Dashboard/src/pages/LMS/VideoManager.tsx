import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { Video, Topic } from "../types"
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react"

const API_BASE = "http://localhost:5000/api"

interface VideoManagerProps {
  videos: Video[]
  topics: Topic[]
  onUpdate: () => void
}

export function VideoManager({ videos, topics, onUpdate }: VideoManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    language: "en",
    topic: "",
    duration: 0,
    thumbnail: "",
  })

  const resetForm = () => {
    setFormData({
      title: "",
      url: "",
      description: "",
      language: "en",
      topic: "",
      duration: 0,
      thumbnail: "",
    })
    setEditingVideo(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingVideo ? `${API_BASE}/videos/${editingVideo._id}` : `${API_BASE}/videos`

      const method = editingVideo ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onUpdate()
        resetForm()
      } else {
        console.error("Error saving video")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleEdit = (video: Video) => {
    setFormData({
      title: video.title,
      url: video.url,
      description: video.description,
      language: video.language,
      topic: video.topic,
      duration: video.duration,
      thumbnail: video.thumbnail,
    })
    setEditingVideo(video)
    setShowForm(true)
  }

  const handleDelete = async (videoId: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      try {
        const response = await fetch(`${API_BASE}/videos/${videoId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          onUpdate()
        }
      } catch (error) {
        console.error("Error deleting video:", error)
      }
    }
  }

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const generateThumbnail = (url: string) => {
    const videoId = extractVideoId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ""
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Video Management</CardTitle>
              <CardDescription>Embed and manage YouTube videos for your learning platform</CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVideo ? "Edit Video" : "Add New Video"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">YouTube URL</label>
                  <Input
                    value={formData.url}
                    onChange={(e) => {
                      const url = e.target.value
                      setFormData({
                        ...formData,
                        url,
                        thumbnail: generateThumbnail(url),
                      })
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Topic</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    required
                  >
                    <option value="">Select Topic</option>
                    {topics.map((topic) => (
                      <option key={topic._id} value={topic._id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingVideo ? "Update Video" : "Add Video"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => {
          const topic = topics.find((t) => t._id === video.topic)
          return (
            <Card key={video._id}>
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-100 rounded-md mb-4 overflow-hidden">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{video.language.toUpperCase()}</Badge>
                  <Badge variant="outline">{topic?.name}</Badge>
                  <Badge variant="outline">{video.duration}min</Badge>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => window.open(video.url, "_blank")}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(video)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(video._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

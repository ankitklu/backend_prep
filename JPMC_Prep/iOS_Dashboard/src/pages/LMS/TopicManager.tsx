import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { Topic, Video } from "../types"
import { Plus, Edit, Trash2, BookOpen } from "lucide-react"

const API_BASE = "http://localhost:5001/api"

interface TopicManagerProps {
  topics: Topic[]
  videos: Video[]
  onUpdate: () => void
}

export function TopicManager({ topics, videos, onUpdate }: TopicManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const resetForm = () => {
    setFormData({ name: "", description: "" })
    setEditingTopic(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingTopic ? `${API_BASE}/topics/${editingTopic._id}` : `${API_BASE}/topics`

      const method = editingTopic ? "PUT" : "POST"

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
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleEdit = (topic: Topic) => {
    setFormData({
      name: topic.name,
      description: topic.description,
    })
    setEditingTopic(topic)
    setShowForm(true)
  }

  const handleDelete = async (topicId: string) => {
    const videosInTopic = videos.filter((v) => v.topic === topicId)

    if (videosInTopic.length > 0) {
      alert("Cannot delete topic with associated videos. Please reassign or delete videos first.")
      return
    }

    if (confirm("Are you sure you want to delete this topic?")) {
      try {
        const response = await fetch(`${API_BASE}/topics/${topicId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          onUpdate()
        }
      } catch (error) {
        console.error("Error deleting topic:", error)
      }
    }
  }

  const getTopicVideoCount = (topicId: string) => {
    return videos.filter((v) => v.topic === topicId).length
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Topic Management</CardTitle>
              <CardDescription>Organize your videos into topics and categories</CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Topic
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTopic ? "Edit Topic" : "Add New Topic"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Topic Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Agriculture Basics, Crop Management"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this topic..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingTopic ? "Update Topic" : "Add Topic"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Topics List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const videoCount = getTopicVideoCount(topic._id)
          const topicVideos = videos.filter((v) => v.topic === topic._id)

          return (
            <Card key={topic._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{topic.name}</h3>
                      <Badge variant="secondary">{videoCount} videos</Badge>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{topic.description || "No description provided"}</p>

                {/* Video List */}
                {topicVideos.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Videos in this topic:</h4>
                    <div className="space-y-1">
                      {topicVideos.slice(0, 3).map((video) => (
                        <div key={video._id} className="text-xs text-gray-500 flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          {video.title}
                        </div>
                      ))}
                      {topicVideos.length > 3 && (
                        <div className="text-xs text-gray-400">+{topicVideos.length - 3} more videos</div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(topic)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(topic._id)} disabled={videoCount > 0}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {topics.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No topics yet</h3>
            <p className="text-gray-600 mb-4">Create your first topic to organize your learning content</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Topic
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

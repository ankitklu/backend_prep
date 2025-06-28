import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Video, Quiz } from "../types"
import { Play, CheckCircle, XCircle, RotateCcw } from "lucide-react"

const API_BASE = "http://localhost:5001/api"

interface VideoPlayerProps {
  video: Video
  userId: string
}

export function VideoPlayer({ video, userId }: VideoPlayerProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchQuiz()
  }, [video._id])

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`${API_BASE}/quizzes/video/${video._id}`)
      if (response.ok) {
        const quizData = await response.json()
        setQuiz(quizData)
      } else {
        // Generate quiz if it doesn't exist
        await generateQuiz()
      }
    } catch (error) {
      console.error("Error fetching quiz:", error)
    }
  }

  const generateQuiz = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/quizzes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: video._id,
          videoTitle: video.title,
          videoDescription: video.description,
          topic: video.topic,
        }),
      })

      if (response.ok) {
        const newQuiz = await response.json()
        setQuiz(newQuiz)
      }
    } catch (error) {
      console.error("Error generating quiz:", error)
    } finally {
      setLoading(false)
    }
  }

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const getEmbedUrl = (url: string) => {
    const videoId = extractVideoId(url)
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ""
  }

  const handleVideoEnd = () => {
    if (quiz && quiz.questions.length > 0) {
      setShowQuiz(true)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = async () => {
    if (!quiz) return

    let correctAnswers = 0
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const finalScore = (correctAnswers / quiz.questions.length) * 100
    setScore(finalScore)
    setQuizCompleted(true)

    // Save progress
    try {
      await fetch(`${API_BASE}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          videoId: video._id,
          completed: true,
          score: finalScore,
        }),
      })
    } catch (error) {
      console.error("Error saving progress:", error)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setQuizCompleted(false)
    setScore(0)
    setShowQuiz(false)
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{video.title}</CardTitle>
              <CardDescription>{video.description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{video.language.toUpperCase()}</Badge>
              <Badge variant="outline">{video.duration}min</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={getEmbedUrl(video.url)}
              title={video.title}
              className="w-full h-full"
              allowFullScreen
              onLoad={() => {
                // Simulate video end for demo purposes
                setTimeout(() => {
                  if (!showQuiz && !quizCompleted) {
                    handleVideoEnd()
                  }
                }, 5001)
              }}
            />
          </div>

          <div className="mt-4 flex justify-between items-center">
            <Button onClick={handleVideoEnd} disabled={!quiz}>
              <Play className="w-4 h-4 mr-2" />
              Start Quiz
            </Button>

            {loading && <div className="text-sm text-gray-600">Generating quiz...</div>}

            {!quiz && !loading && (
              <Button onClick={generateQuiz} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Generate Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quiz Section */}
      {showQuiz && quiz && !quizCompleted && (
        <Card>
          <CardHeader>
            <CardTitle>
              Quiz - Question {currentQuestion + 1} of {quiz.questions.length}
            </CardTitle>
            <CardDescription>Test your understanding of the video content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h3 className="text-lg font-medium mb-4">{quiz.questions[currentQuestion].question}</h3>

              <div className="space-y-2">
                {quiz.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-3 text-left border rounded-lg transition-colors ${
                      selectedAnswers[currentQuestion] === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>

                <Button onClick={handleNextQuestion} disabled={selectedAnswers[currentQuestion] === undefined}>
                  {currentQuestion === quiz.questions.length - 1 ? "Complete Quiz" : "Next"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Results */}
      {quizCompleted && quiz && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Completed!</CardTitle>
            <CardDescription>Here are your results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-green-600">{score.toFixed(0)}%</div>
              <div className="text-lg">
                You got{" "}
                {selectedAnswers.filter((answer, index) => answer === quiz.questions[index].correctAnswer).length} out
                of {quiz.questions.length} questions correct!
              </div>

              {/* Answer Review */}
              <div className="mt-6 space-y-4 text-left">
                <h4 className="font-medium">Review Your Answers:</h4>
                {quiz.questions.map((question, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="font-medium mb-2">{question.question}</div>
                    <div className="space-y-1">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded flex items-center gap-2 ${
                            optionIndex === question.correctAnswer
                              ? "bg-green-100 text-green-800"
                              : selectedAnswers[index] === optionIndex
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-50"
                          }`}
                        >
                          {optionIndex === question.correctAnswer && <CheckCircle className="w-4 h-4" />}
                          {selectedAnswers[index] === optionIndex && optionIndex !== question.correctAnswer && (
                            <XCircle className="w-4 h-4" />
                          )}
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={resetQuiz} className="mt-4">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

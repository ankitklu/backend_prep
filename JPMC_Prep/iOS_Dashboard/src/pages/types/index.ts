export interface Meeting {
  _id: string
  title: string
  description: string
  date: string
  duration: number
  participants: string[]
  createdAt: string
  updatedAt: string
}

export interface Message {
  _id: string
  type: "invitation" | "announcement"
  meetingId?: string
  recipients: string[]
  subject: string
  message: string
  channels: {
    email: boolean
    whatsapp: boolean
  }
  sentAt: string
}

export interface Campaign {
  id?: string;
  name: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  goal: {
    type: string;
    target: number;
    unit: string;
  };
  location: {
    center: {
      lat: number;
      lng: number;
    };
    radius: number;
    polygon?: [number, number][];
  };
  resources: Resource[];
  volunteersRequired: number;
  partners: string[];
  progress: {
    value: number;
    updatedAt: string;
  };
  contact: {
    name: string;
    phone: string;
    email: string;
  };
}

export interface Resource {
  name: string;
  required: number;
  distributed: number;
}

export interface User {
  _id: string
  name: string
  phone: string
  whatsapp?: string
  location?: string
  phoneLocation?: string
  lat?: number
  lng?: number
  subscribed: boolean
  createdAt: string
  updatedAt: string
}

export interface Video {
  _id: string
  title: string
  url: string
  description: string
  language: string
  topic: string
  duration: number
  thumbnail: string
  createdAt: string
}

export interface Topic {
  _id: string
  name: string
  description: string
  videos: string[]
  createdAt: string
}

export interface Quiz {
  _id: string
  videoId: string
  questions: QuizQuestion[]
  createdAt: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

export interface UserProgress {
  _id: string
  userId: string
  videoId: string
  completed: boolean
  score?: number
  completedAt?: string
  createdAt: string
}

export interface ProgressStats {
  totalUsers: number
  totalVideos: number
  completionRate: number
  averageScore: number
  topicProgress: { topic: string; completed: number; total: number }[]
  userProgress: { userName: string; completedVideos: number; totalScore: number }[]
}

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

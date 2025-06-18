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

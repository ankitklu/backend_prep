import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  toAdmins: Boolean,
  toVolunteers: Boolean,
  text: String,
  emailSent: Boolean,
  whatsappSent: Boolean,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Message", MessageSchema);

import twilio from "twilio";
const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_TOKEN!);
export async function sendWhatsApp(to: string, body: string) {
  return client.messages.create({ from: "whatsapp:" + process.env.TWILIO_WHATSAPP_FROM, to: "whatsapp:" + to, body });
}

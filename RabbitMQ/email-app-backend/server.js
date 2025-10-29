import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import amqplib from "amqplib";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const RABBITMQ_URL = process.env.RABBITMQ_URL;
let channel;

async function connectQueue() {
  const connection = await amqplib.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue("emailQueue");
  console.log("Connected to RabbitMQ");
}
connectQueue();


app.post("/send", async (req, res) => {
  console.log("Received request body: ", req.body);
  const { email, subject, message } = req.body;
  const payload = { email, subject, message, timestamp: new Date() };

  await channel.sendToQueue("emailQueue", Buffer.from(JSON.stringify(payload)));
  res.json({ success: true, message: "Message queued successfully!" });
  console.log("Queued: ", payload);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

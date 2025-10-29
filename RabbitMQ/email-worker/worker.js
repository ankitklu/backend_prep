import amqplib from "amqplib";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const MONGO_URL = process.env.MONGO_URL;

const EmailSchema = new mongoose.Schema({
  email: String,
  subject: String,
  message: String,
  timestamp: Date
});
const Email = mongoose.model("Email", EmailSchema);

async function startWorker() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");

  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue("emailQueue");
  console.log("Waiting for messages...");

  channel.consume("emailQueue", async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      console.log("Received: ", data);
      await Email.create(data);
      channel.ack(msg);
    }
  });
}

startWorker();

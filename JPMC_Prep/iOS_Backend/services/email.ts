import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT!,
  secure: process.env.SMTP_SECURE, 
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

export async function sendEmail(to: string[], subject: string, text: string) {
  const info = await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, text });
  return info;
}

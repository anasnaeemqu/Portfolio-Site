import nodemailer from "nodemailer";

/**
 * Professional Mailer utility for Google SMTP
 * 
 * Instructions for User:
 * 1. Go to Replit "Secrets" (padlock icon)
 * 2. Add these keys:
 *    - SMTP_USER: Your Gmail address (e.g. anasnaeem914@gmail.com)
 *    - SMTP_PASS: Your Google App Password (not your regular password)
 *    - CONTACT_RECEIVER: The email address where you want to receive messages
 */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const receiver = process.env.CONTACT_RECEIVER || process.env.SMTP_USER;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials missing. Email not sent.");
    return;
  }

  const mailOptions = {
    from: `"${data.name}" <${process.env.SMTP_USER}>`,
    to: receiver,
    replyTo: data.email,
    subject: `Portfolio Contact: ${data.subject}`,
    text: `You have a new message from your portfolio website.\n\n` +
          `Name: ${data.name}\n` +
          `Email: ${data.email}\n` +
          `Subject: ${data.subject}\n\n` +
          `Message:\n${data.message}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #007bff; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Portfolio Message</h2>
        <p><strong>From:</strong> ${data.name} (<a href="mailto:${data.email}">${data.email}</a>)</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
        <footer style="margin-top: 30px; font-size: 12px; color: #888; border-top: 1px solid #eee; pt: 10px;">
          Sent from your professional portfolio website.
        </footer>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing. Email not sent.");
    return;
  }

  await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: process.env.CONTACT_RECEIVER || "anasnaeem914@gmail.com",
    replyTo: data.email,
    subject: `Portfolio Contact: ${data.subject}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #007bff; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Portfolio Message</h2>
        <p><strong>From:</strong> ${data.name} (<a href="mailto:${data.email}">${data.email}</a>)</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
        <footer style="margin-top: 30px; font-size: 12px; color: #888; border-top: 1px solid #eee;">
          Sent from your professional portfolio website.
        </footer>
      </div>
    `,
  });
}

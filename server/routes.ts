import type { Express } from "express";
import type { Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { sendContactEmail } from "./mailer";

async function seedDatabase(): Promise<void> {
  let defaultId: number | undefined;

  try {
    defaultId = await (storage as any).getDefaultProfileId();
  } catch {
    defaultId = undefined;
  }

  if (defaultId) return;

  const { db } = await import("./db");
  const {
    profiles,
    skills,
    projects,
    experiences,
    educations,
  } = await import("@shared/schema");

  const [profile] = await db
    .insert(profiles)
    .values({
      name: "Muhammad Anas Naeem",
      title: "Software Engineer | iOS & Web Developer",
      tagline:
        "Building high-performance mobile apps and responsive websites with a focus on clean architecture and impactful solutions.",
      about:
        "Hi, I’m Muhammad Anas – a passionate and ambitious Software Developer from Pakistan.",
      location: "Karachi Division, Sindh, Pakistan",
      email: "anasnaeem914@gmail.com",
      githubUrl: "https://github.com/anasnaeemqu",
      linkedinUrl:
        "https://www.linkedin.com/in/muhammad-anas-naeem",
      websiteUrl: "",
    })
    .returning();

  const profileId = profile.id;

  await db.insert(skills).values([
    { profileId, name: "Swift", category: "iOS", level: 90, icon: "Apple", order: 1 },
  ]);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  await seedDatabase();

  app.post(api.contact.create.path, async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      const created = await storage.createContactMessage(input);

      try {
        await sendContactEmail({
          name: input.name,
          email: input.email,
          subject: input.subject,
          message: input.message,
        });
      } catch (mailErr) {
        console.error("Email failed:", mailErr);
      }

      return res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid request",
        });
      }
      throw err;
    }
  });

  return httpServer;
}

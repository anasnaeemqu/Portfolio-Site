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


  // ✅ ADD THIS — the missing portfolio route
  app.get(api.portfolio.get.path, async (req, res) => {
    try {
      const profileId = req.query.profileId
        ? Number(req.query.profileId)
        : await (storage as any).getDefaultProfileId();

      const [profile, skills, projects, experiences, educations] = await Promise.all([
        storage.getProfile(profileId),
        storage.getSkills(profileId),
        storage.getProjects(profileId),
        storage.getExperiences(profileId),
        storage.getEducations(profileId),
      ]);

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      return res.json({ profile, skills, projects, experiences, educations });
    } catch (err) {
      console.error("Portfolio fetch error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // your existing contact route
  app.post(api.contact.create.path, async (req, res) => {
    // ... existing code
  });

  return httpServer;
}

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

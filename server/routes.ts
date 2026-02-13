import type { Express } from "express";
import type { Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { api } from "@shared/routes";

async function seedDatabase(): Promise<void> {
  // Seed only if there is no profile yet
  let defaultId: number | undefined;
  try {
    defaultId = await (storage as any).getDefaultProfileId();
  } catch {
    defaultId = undefined;
  }
  if (defaultId) return;

  // We seed via direct DB inserts here to avoid expanding storage interface
  // beyond what's needed for the portfolio app.
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
      name: "Anas",
      title: "iOS & Flutter Developer",
      tagline: "Building fast, delightful mobile experiences with clean architecture and thoughtful UI.",
      about:
        "Hi, I'm Anas — an iOS & Flutter Developer who enjoys shipping polished apps and collaborating with product teams. I focus on performance, clean code, and pixel-perfect UI.\n\nI’ve worked on mobile products end-to-end: requirements, architecture, implementation, testing, and release. I’m comfortable integrating REST APIs, working with async flows, and building reusable UI systems.",
      location: "",
      email: "anas@example.com",
      githubUrl: "https://github.com/your-handle",
      linkedinUrl: "https://www.linkedin.com/in/your-handle",
      websiteUrl: "",
    })
    .returning();

  const profileId = profile.id;

  await db.insert(skills).values([
    {
      profileId,
      name: "Swift",
      category: "iOS",
      level: 90,
      icon: "Apple",
      order: 1,
    },
    {
      profileId,
      name: "iOS Development",
      category: "iOS",
      level: 88,
      icon: "Smartphone",
      order: 2,
    },
    {
      profileId,
      name: "Dart",
      category: "Flutter",
      level: 85,
      icon: "Code",
      order: 3,
    },
    {
      profileId,
      name: "Flutter",
      category: "Flutter",
      level: 87,
      icon: "Layers",
      order: 4,
    },
    {
      profileId,
      name: "UI/UX",
      category: "Design",
      level: 75,
      icon: "Palette",
      order: 5,
    },
    {
      profileId,
      name: "REST APIs",
      category: "Backend",
      level: 80,
      icon: "Globe",
      order: 6,
    },
  ]);

  await db.insert(projects).values([
    {
      profileId,
      title: "Habit Tracker Mobile App",
      summary:
        "A clean, offline-first habit tracker with reminders, streaks, and analytics.",
      details:
        "Built reusable UI components, implemented local persistence, and added charts for progress analytics.",
      techStack: ["Flutter", "Dart", "SQLite", "REST"],
      liveUrl: "https://example.com/demo",
      repoUrl: "https://github.com/your-handle/habit-tracker",
      imageUrl: "",
      order: 1,
    },
    {
      profileId,
      title: "Food Delivery UI Kit",
      summary:
        "A modern iOS UI kit showcasing responsive layouts, animations, and accessibility.",
      details:
        "Focused on smooth transitions, component-driven UI, and accessibility best practices.",
      techStack: ["Swift", "UIKit", "Auto Layout"],
      liveUrl: "",
      repoUrl: "https://github.com/your-handle/food-delivery-ui",
      imageUrl: "",
      order: 2,
    },
    {
      profileId,
      title: "API-Driven Weather App",
      summary:
        "A lightweight weather app with caching, location support, and clean architecture.",
      details:
        "Implemented async networking, caching, error handling, and a clean MVVM structure.",
      techStack: ["Swift", "SwiftUI", "APIs"],
      liveUrl: "",
      repoUrl: "https://github.com/your-handle/weather-app",
      imageUrl: "",
      order: 3,
    },
  ]);

  await db.insert(experiences).values([
    {
      profileId,
      company: "Mobile Studio",
      role: "iOS & Flutter Developer",
      location: "",
      startDate: "2023",
      endDate: "Present",
      isCurrent: 1,
      description:
        "Developed and maintained mobile apps, collaborated with designers and backend engineers, and shipped features with a focus on performance and UI polish.",
      achievements: [
        "Improved app startup time by optimizing initialization flows.",
        "Built reusable UI components to speed up feature delivery.",
        "Integrated REST APIs with robust error handling and caching.",
      ],
      order: 1,
    },
    {
      profileId,
      company: "Freelance",
      role: "Mobile Developer",
      location: "",
      startDate: "2021",
      endDate: "2023",
      isCurrent: 0,
      description:
        "Delivered client projects from scope to release, including UI implementation and API integrations.",
      achievements: [
        "Shipped multiple MVPs on tight timelines.",
        "Worked directly with stakeholders to iterate quickly.",
      ],
      order: 2,
    },
  ]);

  await db.insert(educations).values([
    {
      profileId,
      school: "University Name",
      degree: "Bachelor's Degree",
      field: "Computer Science",
      startYear: "2018",
      endYear: "2022",
      description: "Relevant coursework: mobile development, software engineering, databases.",
      order: 1,
    },
    {
      profileId,
      school: "Certification Provider",
      degree: "Flutter Development Certificate",
      field: "Mobile Development",
      startYear: "2022",
      endYear: "2022",
      description: "Practical training in Flutter, state management, and app deployment.",
      order: 2,
    },
  ]);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  await seedDatabase();

  app.get(api.portfolio.get.path, async (req, res) => {
    const input = api.portfolio.get.input?.safeParse(req.query);
    const profileId = input?.success ? input.data?.profileId : undefined;
    const portfolio = await storage.getPortfolio(profileId);
    res.json(portfolio);
  });

  app.get(api.profile.get.path, async (req, res) => {
    const profileId = Number(req.params.profileId);
    const profile = await storage.getProfile(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.json(profile);
  });

  app.patch(api.profile.update.path, async (req, res) => {
    const profileId = Number(req.params.profileId);
    try {
      const input = api.profile.update.input.parse(req.body);
      const updated = await storage.updateProfile(profileId, input);
      return res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid request",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  app.get(api.skills.list.path, async (req, res) => {
    const parsed = api.skills.list.input?.safeParse(req.query);
    const profileId = parsed?.success ? parsed.data.profileId : undefined;
    const pid = profileId ?? (await (storage as any).getDefaultProfileId());
    const rows = await storage.listSkills(pid);
    res.json(rows);
  });

  app.get(api.projects.list.path, async (req, res) => {
    const parsed = api.projects.list.input?.safeParse(req.query);
    const profileId = parsed?.success ? parsed.data.profileId : undefined;
    const pid = profileId ?? (await (storage as any).getDefaultProfileId());
    const rows = await storage.listProjects(pid);
    res.json(rows);
  });

  app.get(api.experiences.list.path, async (req, res) => {
    const parsed = api.experiences.list.input?.safeParse(req.query);
    const profileId = parsed?.success ? parsed.data.profileId : undefined;
    const pid = profileId ?? (await (storage as any).getDefaultProfileId());
    const rows = await storage.listExperiences(pid);
    res.json(rows);
  });

  app.get(api.educations.list.path, async (req, res) => {
    const parsed = api.educations.list.input?.safeParse(req.query);
    const profileId = parsed?.success ? parsed.data.profileId : undefined;
    const pid = profileId ?? (await (storage as any).getDefaultProfileId());
    const rows = await storage.listEducations(pid);
    res.json(rows);
  });

  app.post(api.contact.create.path, async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      const created = await storage.createContactMessage(input);
      return res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid request",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  app.get(api.linkedin.status.path, async (_req, res) => {
    res.json({
      supported: false,
      message:
        "Live LinkedIn fetching isn't enabled by default. This site is structured so you can plug in an official data source later (export/API) without changing the UI.",
    });
  });

  return httpServer;
}

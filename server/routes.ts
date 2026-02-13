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
      title: "iOS & Flutter Developer",
      tagline: "Building high-performance, user-centric mobile applications with a focus on clean architecture and delightful UI.",
      about:
        "Passionate and results-driven Mobile Application Developer with a specialized focus on iOS and Flutter. I thrive on creating seamless, high-quality mobile experiences that combine robust technical foundations with intuitive user interfaces.\n\nMy expertise spans the entire mobile development lifecycle, from conceptualizing architecture to implementing complex business logic and shipping to the App Store. I am deeply committed to clean code, reactive programming patterns, and staying at the forefront of mobile technology trends.",
      location: "Lahore, Pakistan",
      email: "anasnaeem@example.com",
      githubUrl: "https://github.com/muhammad-anas-naeem",
      linkedinUrl: "https://www.linkedin.com/in/muhammad-anas-naeem/",
      websiteUrl: "",
    })
    .returning();

  const profileId = profile.id;

  await db.insert(skills).values([
    {
      profileId,
      name: "Swift",
      category: "iOS",
      level: 95,
      icon: "Apple",
      order: 1,
    },
    {
      profileId,
      name: "SwiftUI",
      category: "iOS",
      level: 90,
      icon: "Smartphone",
      order: 2,
    },
    {
      profileId,
      name: "Dart",
      category: "Flutter",
      level: 92,
      icon: "Code",
      order: 3,
    },
    {
      profileId,
      name: "Flutter",
      category: "Flutter",
      level: 94,
      icon: "Layers",
      order: 4,
    },
    {
      profileId,
      name: "Combine / RxSwift",
      category: "Reactive",
      level: 85,
      icon: "Zap",
      order: 5,
    },
    {
      profileId,
      name: "UI/UX Design",
      category: "Design",
      level: 80,
      icon: "Palette",
      order: 6,
    },
    {
      profileId,
      name: "Core Data / Realm",
      category: "Database",
      level: 88,
      icon: "Database",
      order: 7,
    },
    {
      profileId,
      name: "Firebase",
      category: "Backend",
      level: 90,
      icon: "Flame",
      order: 8,
    },
  ]);

  await db.insert(projects).values([
    {
      profileId,
      title: "E-Commerce App (SwiftUI)",
      summary: "A high-performance iOS shopping experience with real-time sync and custom animations.",
      details: "Leveraged SwiftUI and Combine for a reactive UI, implemented a robust caching layer for offline support, and integrated Apple Pay.",
      techStack: ["SwiftUI", "Combine", "MVVM", "Core Data"],
      liveUrl: "",
      repoUrl: "",
      imageUrl: "",
      order: 1,
    },
    {
      profileId,
      title: "Fitness & Workout Tracker (Flutter)",
      summary: "Cross-platform app for tracking workouts, meals, and health metrics with interactive charts.",
      details: "Used BLoC pattern for state management, integrated Google Fit and Apple HealthKit APIs, and built custom visualization tools.",
      techStack: ["Flutter", "Dart", "BLoC", "Firebase"],
      liveUrl: "",
      repoUrl: "",
      imageUrl: "",
      order: 2,
    },
    {
      profileId,
      title: "Real-time Chat Platform",
      summary: "End-to-end encrypted messaging app with file sharing and push notifications.",
      details: "Implemented WebSockets for real-time messaging, optimized media uploads, and integrated Firebase Cloud Messaging.",
      techStack: ["Swift", "Node.js", "Socket.io", "MongoDB"],
      liveUrl: "",
      repoUrl: "",
      imageUrl: "",
      order: 3,
    },
  ]);

  await db.insert(experiences).values([
    {
      profileId,
      company: "Tech Innovations",
      role: "Senior iOS Developer",
      location: "Lahore, Pakistan",
      startDate: "Jan 2023",
      endDate: "Present",
      isCurrent: 1,
      description: "Leading the development of high-traffic mobile applications, focusing on architectural scalability and performance optimization.",
      achievements: [
        "Reduced app crash rate by 40% through rigorous code reviews and unit testing.",
        "Architected a modular UI component library used across multiple enterprise projects.",
        "Mentored junior developers in reactive programming and clean architecture principles.",
      ],
      order: 1,
    },
    {
      profileId,
      company: "App Solutions Ltd",
      role: "Mobile App Developer",
      location: "Lahore, Pakistan",
      startDate: "Jun 2021",
      endDate: "Dec 2022",
      isCurrent: 0,
      description: "Worked as a key contributor to various client projects, specializing in cross-platform development with Flutter.",
      achievements: [
        "Successfully delivered 5+ production-grade apps on both iOS and Android platforms.",
        "Integrated complex third-party APIs for payment gateways and social authentication.",
        "Optimized app bundles, reducing overall download size by 25%.",
      ],
      order: 2,
    },
  ]);

  await db.insert(educations).values([
    {
      profileId,
      school: "University of Central Punjab",
      degree: "Bachelor of Science in Computer Science",
      field: "Software Engineering",
      startYear: "2017",
      endYear: "2021",
      description: "Focused on mobile computing, software design patterns, and human-computer interaction.",
      order: 1,
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

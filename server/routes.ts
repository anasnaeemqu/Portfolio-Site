import { sendContactEmail } from "./mailer";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  await seedDatabase();

  app.get(api.portfolio.get.path, async (req, res) => {
    let profileId: number | undefined;

    if (api.portfolio.get.input) {
      const parsed = api.portfolio.get.input.safeParse(req.query);
      if (parsed.success) {
        profileId = parsed.data.profileId;
      }
    }

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

  // SKILLS
  app.get(api.skills.list.path, async (req, res) => {
    let profileId: number | undefined;

    if (api.skills.list.input) {
      const parsed = api.skills.list.input.safeParse(req.query);
      if (parsed.success) {
        profileId = parsed.data.profileId;
      }
    }

    const pid = profileId ?? (await (storage as any).getDefaultProfileId());
    const rows = await storage.listSkills(pid);
    res.json(rows);
  });

  // PROJECTS
  app.get(api.projects.list.path, async (req, res) => {
    let profileId: number | undefined;

    if (api.projects.list.input) {
      const parsed = api.projects.list.input.safeParse(req.query);
      if (parsed.success) {
        profileId = parsed.data.profileId;
      }
    }

    const pid = profileId ?? (await (storage as any).getDefaultProfileId());
    const rows = await storage.listProjects(pid);
    res.json(rows);
  });

  // EXPERIENCES
  app.get(api.experiences.list.path, async (req, res) => {
    let profileId: number | undefined;

    if (api.experiences.list.input) {
      const parsed = api.experiences.list.input.safeParse(req.query);
      if (parsed.success) {
        profileId = parsed.data.profileId;
      }
    }

    const pid = profileId ?? (await (storage as any).getDefaultProfileId());
    const rows = await storage.listExperiences(pid);
    res.json(rows);
  });

  // EDUCATIONS
  app.get(api.educations.list.path, async (req, res) => {
    let profileId: number | undefined;

    if (api.educations.list.input) {
      const parsed = api.educations.list.input.safeParse(req.query);
      if (parsed.success) {
        profileId = parsed.data.profileId;
      }
    }

    const pid = profileId ?? (await (storage as any).getDefaultProfileId());
    const rows = await storage.listEducations(pid);
    res.json(rows);
  });

  // CONTACT
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
        console.error("Failed to send contact email:", mailErr);
      }

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

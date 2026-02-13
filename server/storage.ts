import { db } from "./db";
import {
  profiles,
  skills,
  projects,
  experiences,
  educations,
  contactMessages,
  type Profile,
  type Skill,
  type Project,
  type Experience,
  type Education,
  type ContactMessage,
  type PortfolioResponse,
  type UpdateProfileRequest,
  type CreateContactMessageRequest,
} from "@shared/schema";
import { asc, eq } from "drizzle-orm";

export interface IStorage {
  getPortfolio(profileId?: number): Promise<PortfolioResponse>;
  getProfile(profileId: number): Promise<Profile | undefined>;
  updateProfile(
    profileId: number,
    updates: UpdateProfileRequest,
  ): Promise<Profile>;

  listSkills(profileId: number): Promise<Skill[]>;
  listProjects(profileId: number): Promise<Project[]>;
  listExperiences(profileId: number): Promise<Experience[]>;
  listEducations(profileId: number): Promise<Education[]>;

  createContactMessage(input: CreateContactMessageRequest): Promise<ContactMessage>;
}

export class DatabaseStorage implements IStorage {
  async getPortfolio(profileId?: number): Promise<PortfolioResponse> {
    const pid = profileId ?? (await this.getDefaultProfileId());
    const profile = await this.getProfile(pid);
    if (!profile) {
      throw new Error("Profile not found");
    }

    const [skillsList, projectsList, experiencesList, educationsList] =
      await Promise.all([
        this.listSkills(pid),
        this.listProjects(pid),
        this.listExperiences(pid),
        this.listEducations(pid),
      ]);

    return {
      profile,
      skills: skillsList,
      projects: projectsList,
      experiences: experiencesList,
      educations: educationsList,
    };
  }

  async getDefaultProfileId(): Promise<number> {
    const rows = await db
      .select({ id: profiles.id })
      .from(profiles)
      .orderBy(asc(profiles.id))
      .limit(1);
    if (!rows[0]) {
      throw new Error("No profile exists");
    }
    return rows[0].id;
  }

  async getProfile(profileId: number): Promise<Profile | undefined> {
    const rows = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, profileId))
      .limit(1);
    return rows[0];
  }

  async updateProfile(
    profileId: number,
    updates: UpdateProfileRequest,
  ): Promise<Profile> {
    const [updated] = await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.id, profileId))
      .returning();
    if (!updated) {
      throw new Error("Profile not found");
    }
    return updated;
  }

  async listSkills(profileId: number): Promise<Skill[]> {
    return await db
      .select()
      .from(skills)
      .where(eq(skills.profileId, profileId))
      .orderBy(asc(skills.order), asc(skills.id));
  }

  async listProjects(profileId: number): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.profileId, profileId))
      .orderBy(asc(projects.order), asc(projects.id));
  }

  async listExperiences(profileId: number): Promise<Experience[]> {
    return await db
      .select()
      .from(experiences)
      .where(eq(experiences.profileId, profileId))
      .orderBy(asc(experiences.order), asc(experiences.id));
  }

  async listEducations(profileId: number): Promise<Education[]> {
    return await db
      .select()
      .from(educations)
      .where(eq(educations.profileId, profileId))
      .orderBy(asc(educations.order), asc(educations.id));
  }

  async createContactMessage(
    input: CreateContactMessageRequest,
  ): Promise<ContactMessage> {
    const [created] = await db
      .insert(contactMessages)
      .values(input)
      .returning();
    if (!created) {
      throw new Error("Failed to create message");
    }
    return created;
  }
}

export const storage = new DatabaseStorage();

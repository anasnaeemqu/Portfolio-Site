import { pgTable, serial, text, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================
// Portfolio schema (single public profile)
// ============================================

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull(),
  about: text("about").notNull(),
  location: text("location"),
  email: text("email"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  websiteUrl: text("website_url"),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  location: text("location"),
  startDate: varchar("start_date", { length: 32 }).notNull(),
  endDate: varchar("end_date", { length: 32 }),
  isCurrent: integer("is_current").notNull().default(0), // 0/1 for simplicity
  description: text("description").notNull(),
  achievements: text("achievements").array().notNull().default([]),
  order: integer("order").notNull().default(0),
});

export const educations = pgTable("educations", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  school: text("school").notNull(),
  degree: text("degree").notNull(),
  field: text("field"),
  startYear: varchar("start_year", { length: 16 }),
  endYear: varchar("end_year", { length: 16 }),
  description: text("description").notNull().default(""),
  order: integer("order").notNull().default(0),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  details: text("details").notNull().default(""),
  techStack: text("tech_stack").array().notNull().default([]),
  liveUrl: text("live_url"),
  repoUrl: text("repo_url"),
  imageUrl: text("image_url"),
  order: integer("order").notNull().default(0),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull().default("Technical"),
  level: integer("level").notNull().default(70), // 0-100
  icon: text("icon"), // lucide icon name hint for frontend
  order: integer("order").notNull().default(0),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
});

// ============================================
// Insert schemas
// ============================================

export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true });
export const insertExperienceSchema = createInsertSchema(experiences).omit({ id: true });
export const insertEducationSchema = createInsertSchema(educations).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true });

// ============================================
// Explicit API contract types
// ============================================

export type Profile = typeof profiles.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Education = typeof educations.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type CreateProfileRequest = z.infer<typeof insertProfileSchema>;
export type UpdateProfileRequest = Partial<CreateProfileRequest>;

export type CreateExperienceRequest = z.infer<typeof insertExperienceSchema>;
export type UpdateExperienceRequest = Partial<CreateExperienceRequest>;

export type CreateEducationRequest = z.infer<typeof insertEducationSchema>;
export type UpdateEducationRequest = Partial<CreateEducationRequest>;

export type CreateProjectRequest = z.infer<typeof insertProjectSchema>;
export type UpdateProjectRequest = Partial<CreateProjectRequest>;

export type CreateSkillRequest = z.infer<typeof insertSkillSchema>;
export type UpdateSkillRequest = Partial<CreateSkillRequest>;

export type CreateContactMessageRequest = z.infer<typeof insertContactMessageSchema>;

export type PortfolioResponse = {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  educations: Education[];
};

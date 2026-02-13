import { z } from "zod";
import {
  insertContactMessageSchema,
  insertEducationSchema,
  insertExperienceSchema,
  insertProfileSchema,
  insertProjectSchema,
  insertSkillSchema,
  type ContactMessage,
  type Education,
  type Experience,
  type PortfolioResponse,
  type Profile,
  type Project,
  type Skill,
} from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

const profileIdInput = z.object({ profileId: z.coerce.number().int().positive() });

export const api = {
  portfolio: {
    get: {
      method: "GET" as const,
      path: "/api/portfolio" as const,
      input: z
        .object({
          profileId: z.coerce.number().int().positive().optional(),
        })
        .optional(),
      responses: {
        200: z.custom<PortfolioResponse>(),
      },
    },
  },
  profile: {
    get: {
      method: "GET" as const,
      path: "/api/profile/:profileId" as const,
      responses: {
        200: z.custom<Profile>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: "PATCH" as const,
      path: "/api/profile/:profileId" as const,
      input: insertProfileSchema.partial(),
      responses: {
        200: z.custom<Profile>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  skills: {
    list: {
      method: "GET" as const,
      path: "/api/skills" as const,
      input: profileIdInput.optional(),
      responses: {
        200: z.array(z.custom<Skill>()),
      },
    },
  },
  projects: {
    list: {
      method: "GET" as const,
      path: "/api/projects" as const,
      input: profileIdInput.optional(),
      responses: {
        200: z.array(z.custom<Project>()),
      },
    },
  },
  experiences: {
    list: {
      method: "GET" as const,
      path: "/api/experiences" as const,
      input: profileIdInput.optional(),
      responses: {
        200: z.array(z.custom<Experience>()),
      },
    },
  },
  educations: {
    list: {
      method: "GET" as const,
      path: "/api/educations" as const,
      input: profileIdInput.optional(),
      responses: {
        200: z.array(z.custom<Education>()),
      },
    },
  },
  contact: {
    create: {
      method: "POST" as const,
      path: "/api/contact" as const,
      input: insertContactMessageSchema.extend({
        profileId: z.coerce.number().int().positive(),
      }),
      responses: {
        201: z.custom<ContactMessage>(),
        400: errorSchemas.validation,
      },
    },
  },
  linkedin: {
    status: {
      method: "GET" as const,
      path: "/api/linkedin/status" as const,
      responses: {
        200: z.object({
          supported: z.boolean(),
          message: z.string(),
        }),
      },
    },
  },
} as const;

export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  let url = path;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, String(value));
    }
  }
  return url;
}

// Type helpers (inferred from schemas)
export type PortfolioGetInput = z.infer<typeof api.portfolio.get.input>;
export type PortfolioGetResponse = z.infer<typeof api.portfolio.get.responses[200]>;

export type ContactCreateInput = z.infer<typeof api.contact.create.input>;
export type ContactCreateResponse = z.infer<typeof api.contact.create.responses[201]>;

export type ValidationError = z.infer<typeof errorSchemas.validation>;
export type NotFoundError = z.infer<typeof errorSchemas.notFound>;
export type InternalError = z.infer<typeof errorSchemas.internal>;

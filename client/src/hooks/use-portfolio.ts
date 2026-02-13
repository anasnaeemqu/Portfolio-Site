import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ContactCreateInput, type PortfolioGetInput } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useLinkedInStatus() {
  return useQuery({
    queryKey: [api.linkedin.status.path],
    queryFn: async () => {
      const res = await fetch(api.linkedin.status.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch LinkedIn status");
      const json = await res.json();
      return parseWithLogging(api.linkedin.status.responses[200], json, "linkedin.status");
    },
  });
}

export function usePortfolio(input?: PortfolioGetInput) {
  const key = [api.portfolio.get.path, input?.profileId ?? "default"] as const;
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const validated = api.portfolio.get.input.safeParse(input);
      if (!validated.success) {
        console.error("[Zod] portfolio.get input invalid:", validated.error.format());
        throw validated.error;
      }

      const url = new URL(api.portfolio.get.path, window.location.origin);
      if (validated.data?.profileId) url.searchParams.set("profileId", String(validated.data.profileId));

      const res = await fetch(url.toString().replace(window.location.origin, ""), {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch portfolio");
      const json = await res.json();
      return parseWithLogging(api.portfolio.get.responses[200], json, "portfolio.get");
    },
  });
}

export function useCreateContactMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ContactCreateInput) => {
      const validated = api.contact.create.input.safeParse(data);
      if (!validated.success) {
        console.error("[Zod] contact.create input invalid:", validated.error.format());
        throw validated.error;
      }

      const res = await fetch(api.contact.create.path, {
        method: api.contact.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errJson = await res.json().catch(() => ({}));
          const parsed = api.contact.create.responses[400].safeParse(errJson);
          if (parsed.success) throw new Error(parsed.data.message);
          throw new Error("Invalid request");
        }
        throw new Error("Failed to send message");
      }

      const json = await res.json();
      return parseWithLogging(api.contact.create.responses[201], json, "contact.create");
    },
    onSuccess: async () => {
      // No list endpoint to invalidate, but keep UX crisp (and future-proof).
      await queryClient.invalidateQueries({ queryKey: [api.portfolio.get.path] });
    },
  });
}

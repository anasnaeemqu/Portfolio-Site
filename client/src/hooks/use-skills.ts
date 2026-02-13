import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useSkills(profileId?: number) {
  return useQuery({
    queryKey: [api.skills.list.path, profileId ?? "default"],
    queryFn: async () => {
      const url = new URL(api.skills.list.path, window.location.origin);
      if (profileId) url.searchParams.set("profileId", String(profileId));

      const res = await fetch(url.toString().replace(window.location.origin, ""), {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch skills");
      const json = await res.json();
      return parseWithLogging(api.skills.list.responses[200], json, "skills.list");
    },
  });
}

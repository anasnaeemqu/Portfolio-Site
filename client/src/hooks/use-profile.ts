import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { UpdateProfileRequest } from "@shared/schema";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useProfile(profileId: number) {
  return useQuery({
    queryKey: [api.profile.get.path, profileId],
    queryFn: async () => {
      const url = buildUrl(api.profile.get.path, { profileId });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      const json = await res.json();
      return parseWithLogging(api.profile.get.responses[200], json, "profile.get");
    },
    enabled: Number.isFinite(profileId),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ profileId, updates }: { profileId: number; updates: UpdateProfileRequest }) => {
      const validated = api.profile.update.input.safeParse(updates);
      if (!validated.success) {
        console.error("[Zod] profile.update input invalid:", validated.error.format());
        throw validated.error;
      }

      const url = buildUrl(api.profile.update.path, { profileId });
      const res = await fetch(url, {
        method: api.profile.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errJson = await res.json().catch(() => ({}));
          const parsed = api.profile.update.responses[400].safeParse(errJson);
          if (parsed.success) throw new Error(parsed.data.message);
          throw new Error("Invalid update");
        }
        if (res.status === 404) throw new Error("Profile not found");
        throw new Error("Failed to update profile");
      }

      const json = await res.json();
      return parseWithLogging(api.profile.update.responses[200], json, "profile.update");
    },
    onSuccess: async (_updated, vars) => {
      await queryClient.invalidateQueries({ queryKey: [api.profile.get.path, vars.profileId] });
      await queryClient.invalidateQueries({ queryKey: [api.portfolio.get.path] });
    },
  });
}

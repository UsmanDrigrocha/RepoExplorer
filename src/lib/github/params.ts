import { z } from "zod";
import { GithubApiError } from "./errors";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(100).default(1),
  perPage: z.coerce.number().int().min(1).max(50).default(12),
});

export const repoSortSchema = z.object({
  sort: z
    .enum(["created", "updated", "pushed", "full_name"])
    .default("updated"),
  direction: z.enum(["asc", "desc"]).default("desc"),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1, "Query must not be empty").max(256),
});

export function parseSearchParams<T extends z.ZodTypeAny>(
  searchParams: URLSearchParams,
  schema: T,
): z.infer<T> {
  const raw = Object.fromEntries(searchParams.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new GithubApiError(
      parsed.error.issues.map((i) => i.message).join("; "),
      "validation",
      422,
    );
  }
  return parsed.data;
}

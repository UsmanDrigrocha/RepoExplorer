import type { NextRequest } from "next/server";
import { listRepoCommits } from "@/lib/github/client";
import { withCache } from "@/lib/github/cache";
import { jsonError, jsonOk } from "@/lib/github/respond";
import { paginationSchema, parseSearchParams } from "@/lib/github/params";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  try {
    const { owner, repo } = await params;
    const { page, perPage } = parseSearchParams(
      request.nextUrl.searchParams,
      paginationSchema,
    );

    const cacheKey = `commits:${owner.toLowerCase()}/${repo.toLowerCase()}:${page}:${perPage}`;
    const { value, hit } = await withCache(cacheKey, () =>
      listRepoCommits(owner, repo, { page, perPage }),
    );

    return jsonOk(value.data, { rateLimit: value.rateLimit, cacheHit: hit });
  } catch (error) {
    return jsonError(error);
  }
}

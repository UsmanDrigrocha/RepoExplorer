import type { NextRequest } from "next/server";
import { listUserRepos } from "@/lib/github/client";
import { withCache } from "@/lib/github/cache";
import { jsonError, jsonOk } from "@/lib/github/respond";
import {
  paginationSchema,
  parseSearchParams,
  repoSortSchema,
} from "@/lib/github/params";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    const searchParams = request.nextUrl.searchParams;
    const { page, perPage } = parseSearchParams(searchParams, paginationSchema);
    const { sort, direction } = parseSearchParams(searchParams, repoSortSchema);

    const cacheKey = `repos:${username.toLowerCase()}:${page}:${perPage}:${sort}:${direction}`;
    const { value, hit } = await withCache(cacheKey, () =>
      listUserRepos(username, { page, perPage, sort, direction }),
    );

    return jsonOk(value.data, { rateLimit: value.rateLimit, cacheHit: hit });
  } catch (error) {
    return jsonError(error);
  }
}

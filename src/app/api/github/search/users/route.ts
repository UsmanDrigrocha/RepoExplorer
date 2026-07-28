import type { NextRequest } from "next/server";
import { searchUsers } from "@/lib/github/client";
import { withCache } from "@/lib/github/cache";
import { jsonError, jsonOk } from "@/lib/github/respond";
import {
  paginationSchema,
  parseSearchParams,
  searchQuerySchema,
} from "@/lib/github/params";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { q } = parseSearchParams(searchParams, searchQuerySchema);
    const { page, perPage } = parseSearchParams(searchParams, paginationSchema);

    const cacheKey = `search-users:${q}:${page}:${perPage}`;
    const { value, hit } = await withCache(cacheKey, () =>
      searchUsers(q, page, perPage),
    );

    return jsonOk(value.data, { rateLimit: value.rateLimit, cacheHit: hit });
  } catch (error) {
    return jsonError(error);
  }
}

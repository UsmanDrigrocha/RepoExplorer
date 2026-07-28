import { getRepo } from "@/lib/github/client";
import { withCache } from "@/lib/github/cache";
import { jsonError, jsonOk } from "@/lib/github/respond";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> },
) {
  try {
    const { owner, repo } = await params;
    const cacheKey = `repo:${owner.toLowerCase()}/${repo.toLowerCase()}`;
    const { value, hit } = await withCache(cacheKey, () =>
      getRepo(owner, repo),
    );

    return jsonOk(value.data, { rateLimit: value.rateLimit, cacheHit: hit });
  } catch (error) {
    return jsonError(error);
  }
}

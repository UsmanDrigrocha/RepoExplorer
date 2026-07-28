import { getUser } from "@/lib/github/client";
import { withCache } from "@/lib/github/cache";
import { jsonError, jsonOk } from "@/lib/github/respond";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    const cacheKey = `user:${username.toLowerCase()}`;
    const { value, hit } = await withCache(cacheKey, () => getUser(username));

    return jsonOk(value.data, { rateLimit: value.rateLimit, cacheHit: hit });
  } catch (error) {
    return jsonError(error);
  }
}

import { NextResponse } from "next/server";
import { GithubApiError, statusForErrorKind } from "./errors";
import type { RateLimitInfo } from "./client";

/**
 * Every route handler funnels through here so API consumers get one
 * consistent envelope: { data } on success, { error } on failure, and
 * GitHub's rate-limit + our cache status surfaced as response headers.
 */
export function jsonOk<T>(
  data: T,
  opts: { rateLimit?: RateLimitInfo; cacheHit?: boolean } = {},
) {
  const res = NextResponse.json({ data });
  if (opts.rateLimit) {
    res.headers.set("x-ratelimit-limit", String(opts.rateLimit.limit));
    res.headers.set("x-ratelimit-remaining", String(opts.rateLimit.remaining));
    res.headers.set("x-ratelimit-reset", String(opts.rateLimit.reset));
  }
  res.headers.set("x-cache", opts.cacheHit ? "HIT" : "MISS");
  return res;
}

export function jsonError(error: unknown) {
  if (error instanceof GithubApiError) {
    const res = NextResponse.json(
      { error: { message: error.message, kind: error.kind } },
      { status: statusForErrorKind(error.kind) },
    );
    if (error.rateLimitReset) {
      res.headers.set("x-ratelimit-reset", String(error.rateLimitReset));
      res.headers.set(
        "retry-after",
        String(
          Math.max(0, error.rateLimitReset - Math.floor(Date.now() / 1000)),
        ),
      );
    }
    return res;
  }

  console.error("Unhandled API error:", error);
  return NextResponse.json(
    { error: { message: "Internal server error", kind: "unknown" } },
    { status: 500 },
  );
}

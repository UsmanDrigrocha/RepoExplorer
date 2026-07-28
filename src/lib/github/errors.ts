export type GithubErrorKind =
  "not_found" | "rate_limited" | "validation" | "upstream" | "unknown";

/**
 * Normalizes every failure mode (network, GitHub 4xx/5xx, schema mismatch)
 * into one shape so route handlers can map it to an HTTP response without
 * re-deriving what went wrong.
 */
export class GithubApiError extends Error {
  readonly kind: GithubErrorKind;
  readonly status: number;
  readonly rateLimitReset?: number;

  constructor(
    message: string,
    kind: GithubErrorKind,
    status: number,
    rateLimitReset?: number,
  ) {
    super(message);
    this.name = "GithubApiError";
    this.kind = kind;
    this.status = status;
    this.rateLimitReset = rateLimitReset;
  }
}

export function statusForErrorKind(kind: GithubErrorKind): number {
  switch (kind) {
    case "not_found":
      return 404;
    case "rate_limited":
      return 429;
    case "validation":
      return 422;
    case "upstream":
      return 502;
    default:
      return 500;
  }
}

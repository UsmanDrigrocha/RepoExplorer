export class ApiError extends Error {
  readonly status: number;
  readonly kind: string;

  constructor(message: string, status: number, kind: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.kind = kind;
  }
}

/** Thin wrapper around our own /api/github/* routes — never calls GitHub directly from the browser. */
export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(path);
  const json = await res.json();

  if (!res.ok) {
    throw new ApiError(
      json?.error?.message ?? "Request failed",
      res.status,
      json?.error?.kind ?? "unknown",
    );
  }

  return json.data as T;
}

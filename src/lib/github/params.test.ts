import { describe, expect, it } from "vitest";
import { GithubApiError } from "./errors";
import {
  paginationSchema,
  parseSearchParams,
  searchQuerySchema,
} from "./params";

describe("parseSearchParams", () => {
  it("applies defaults when pagination params are absent", () => {
    const params = new URLSearchParams();
    const result = parseSearchParams(params, paginationSchema);
    expect(result).toEqual({ page: 1, perPage: 12 });
  });

  it("coerces string query params to numbers", () => {
    const params = new URLSearchParams({ page: "3", perPage: "25" });
    const result = parseSearchParams(params, paginationSchema);
    expect(result).toEqual({ page: 3, perPage: 25 });
  });

  it("throws a GithubApiError with kind 'validation' for out-of-range values", () => {
    const params = new URLSearchParams({ page: "0" });
    expect(() => parseSearchParams(params, paginationSchema)).toThrow(
      GithubApiError,
    );
    try {
      parseSearchParams(params, paginationSchema);
    } catch (error) {
      expect((error as GithubApiError).kind).toBe("validation");
    }
  });

  it("rejects an empty search query", () => {
    const params = new URLSearchParams({ q: "" });
    expect(() => parseSearchParams(params, searchQuerySchema)).toThrow(
      GithubApiError,
    );
  });

  it("accepts a valid search query", () => {
    const params = new URLSearchParams({ q: "octocat" });
    expect(parseSearchParams(params, searchQuerySchema)).toEqual({
      q: "octocat",
    });
  });
});

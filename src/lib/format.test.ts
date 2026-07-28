import { describe, expect, it } from "vitest";
import { formatCompactNumber, formatDate, formatRelativeTime } from "./format";

describe("formatCompactNumber", () => {
  it("formats small numbers as-is", () => {
    expect(formatCompactNumber(42)).toBe("42");
  });

  it("compacts thousands", () => {
    expect(formatCompactNumber(1200)).toBe("1.2K");
  });

  it("compacts millions", () => {
    expect(formatCompactNumber(3_400_000)).toBe("3.4M");
  });
});

describe("formatDate", () => {
  it("formats an ISO date as a readable string", () => {
    expect(formatDate("2020-01-15T00:00:00Z")).toBe("Jan 15, 2020");
  });
});

describe("formatRelativeTime", () => {
  it("describes a date a few days in the past", () => {
    const threeDaysAgo = new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000,
    ).toISOString();
    expect(formatRelativeTime(threeDaysAgo)).toBe("3 days ago");
  });

  it("describes a date in the future", () => {
    const inTwoDays = new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000,
    ).toISOString();
    expect(formatRelativeTime(inTwoDays)).toBe("in 2 days");
  });
});

import { describe, expect, it, vi } from "vitest";
import { withCache } from "./cache";

describe("withCache", () => {
  it("calls the fetcher on a cache miss and reports hit: false", async () => {
    const fetcher = vi.fn().mockResolvedValue("fresh-value");
    const { value, hit } = await withCache(`key-${Math.random()}`, fetcher);
    expect(value).toBe("fresh-value");
    expect(hit).toBe(false);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("returns the cached value on a subsequent call and skips the fetcher", async () => {
    const key = `key-${Math.random()}`;
    const fetcher = vi.fn().mockResolvedValue("cached-value");

    await withCache(key, fetcher);
    const second = await withCache(key, fetcher);

    expect(second.value).toBe("cached-value");
    expect(second.hit).toBe(true);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

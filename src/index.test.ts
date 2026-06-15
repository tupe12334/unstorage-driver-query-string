import { describe, it, expect, beforeEach, vi } from "vitest";
import { createStorage } from "unstorage";
import { createQueryStringDriver } from "./index";

// Mock window object and history API
const mockHistory = {
  pushState: vi.fn(),
  replaceState: vi.fn(),
};

const mockLocation = {
  href: "https://example.com/",
  origin: "https://example.com",
};

Object.defineProperty(global, "window", {
  value: {
    location: mockLocation,
    history: mockHistory,
  },
  writable: true,
});

describe("Query String Driver", () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    mockLocation.href = "https://example.com/";
  });

  it("should create driver with default options", () => {
    const driver = createQueryStringDriver();
    expect(driver.name).toBe("query-string");
  });

  it("should set and get string values", async () => {
    mockLocation.href = "https://example.com/";
    const storage = createStorage({
      driver: createQueryStringDriver({ updateHistory: false }),
    });

    await storage.setItem("test", "value");
    expect(await storage.getItem("test")).toBe("value");
  });

  it("should set and get number values", async () => {
    mockLocation.href = "https://example.com/";
    const storage = createStorage({
      driver: createQueryStringDriver({ updateHistory: false }),
    });

    await storage.setItem("number", 42);
    expect(await storage.getItem("number")).toBe(42);
  });

  it("should set and get boolean values", async () => {
    mockLocation.href = "https://example.com/";
    const storage = createStorage({
      driver: createQueryStringDriver({ updateHistory: false }),
    });

    await storage.setItem("bool", true);
    expect(await storage.getItem("bool")).toBe(true);

    await storage.setItem("bool2", false);
    expect(await storage.getItem("bool2")).toBe(false);
  });

  it("should set and get object values", async () => {
    mockLocation.href = "https://example.com/";
    const storage = createStorage({
      driver: createQueryStringDriver({ updateHistory: false }),
    });

    const obj = { foo: "bar", nested: { value: 123 } };
    await storage.setItem("object", obj);
    expect(await storage.getItem("object")).toEqual(obj);
  });

  it("should handle null values", async () => {
    mockLocation.href = "https://example.com/";
    const storage = createStorage({
      driver: createQueryStringDriver({ updateHistory: false }),
    });

    await storage.setItem("null", null);
    expect(await storage.getItem("null")).toBe(null);
  });

  it("should use base prefix for keys", async () => {
    mockLocation.href = "https://example.com/";
    const storage = createStorage({
      driver: createQueryStringDriver({ base: "app", updateHistory: false }),
    });

    await storage.setItem("test", "value");

    // Verify the data can be retrieved through the storage system
    expect(await storage.getItem("test")).toBe("value");
  });

  it("should check if item exists", async () => {
    mockLocation.href = "https://example.com/?test=value";
    const storage = createStorage({
      driver: createQueryStringDriver({ updateHistory: false }),
    });

    expect(await storage.hasItem("test")).toBe(true);
    expect(await storage.hasItem("nonexistent")).toBe(false);
  });

  it("should remove items", async () => {
    mockLocation.href = "https://example.com/?test=value";
    const storage = createStorage({
      driver: createQueryStringDriver({ updateHistory: false }),
    });

    expect(await storage.hasItem("test")).toBe(true);
    await storage.removeItem("test");
    expect(await storage.hasItem("test")).toBe(false);
  });

  it("should get all keys", async () => {
    mockLocation.href = "https://example.com/?foo=1&bar=2&baz=3";
    const storage = createStorage({
      driver: createQueryStringDriver({ updateHistory: false }),
    });

    const keys = await storage.getKeys();
    expect(keys).toEqual(expect.arrayContaining(["foo", "bar", "baz"]));
  });

  it("should get keys with base prefix", async () => {
    mockLocation.href =
      "https://example.com/?app[foo]=1&other_bar=2&app[baz]=3";
    const storage = createStorage({
      driver: createQueryStringDriver({ base: "app", updateHistory: false }),
    });

    const keys = await storage.getKeys();
    expect(keys).toEqual(expect.arrayContaining(["foo", "baz"]));
    expect(keys).not.toContain("other_bar");
  });

  it("should clear storage", async () => {
    mockLocation.href = "https://example.com/?foo=1&bar=2";
    const storage = createStorage({
      driver: createQueryStringDriver({ updateHistory: false }),
    });

    expect(await storage.getKeys()).toHaveLength(2);
    await storage.clear();
    expect(await storage.getKeys()).toHaveLength(0);
  });

  it("should clear only prefixed keys when using base", async () => {
    mockLocation.href =
      "https://example.com/?app[foo]=1&other_bar=2&app[baz]=3";
    const storage = createStorage({
      driver: createQueryStringDriver({ base: "app", updateHistory: false }),
    });

    // First verify we can read the existing data (qs parses numeric strings as numbers)
    expect(await storage.getItem("foo")).toBe(1);
    expect(await storage.getItem("baz")).toBe(3);

    await storage.clear();

    // Should only clear app prefixed keys - verify through storage
    expect(await storage.getItem("foo")).toBe(null);
    expect(await storage.getItem("baz")).toBe(null);

    // The original non-prefixed keys should still exist in the URL
    // but they're not accessible through this storage instance with base "app"
  });

  it("should update history when enabled", async () => {
    mockLocation.href = "https://example.com/";
    const storage = createStorage({
      driver: createQueryStringDriver({
        updateHistory: true,
        historyMethod: "pushState",
      }),
    });

    await storage.setItem("test", "value");

    expect(mockHistory.pushState).toHaveBeenCalledWith(
      null,
      "",
      "https://example.com/?test=value"
    );
  });

  it("should use replaceState when configured", async () => {
    mockLocation.href = "https://example.com/";
    const storage = createStorage({
      driver: createQueryStringDriver({
        updateHistory: true,
        historyMethod: "replaceState",
      }),
    });

    await storage.setItem("test", "value");

    expect(mockHistory.replaceState).toHaveBeenCalledWith(
      null,
      "",
      "https://example.com/?test=value"
    );
  });

  it("should respect maxUrlLength", async () => {
    mockLocation.href = "https://example.com/";
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const storage = createStorage({
      driver: createQueryStringDriver({
        updateHistory: true,
        maxUrlLength: 50,
      }),
    });

    // This should create a URL longer than 50 characters
    await storage.setItem("verylongkey", "verylongvaluethatexceedsthelimit");

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("URL length")
    );

    consoleSpy.mockRestore();
  });

  it("should work with custom URL", async () => {
    const storage = createStorage({
      driver: createQueryStringDriver({
        url: "https://custom.com/?existing=param",
        updateHistory: false,
      }),
    });

    await storage.setItem("test", "value");
    expect(await storage.getItem("test")).toBe("value");
  });
});

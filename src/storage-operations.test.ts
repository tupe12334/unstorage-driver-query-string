import { describe, it, expect, vi, beforeEach } from "vitest";
import { createStorageOperations } from "./storage-operations";
import type { DataManager } from "./data-manager-interface";
import { QueryStringDriverError } from "./errors";

describe("Storage Operations", () => {
  let mockDataManager: DataManager;
  let mockUpdateUrl: vi.Mock;
  let operations: ReturnType<typeof createStorageOperations>;
  const basePrefix = "test";

  beforeEach(() => {
    vi.clearAllMocks();
    mockDataManager = {
      getCurrentData: vi.fn(),
    };
    mockUpdateUrl = vi.fn();
    operations = createStorageOperations(mockDataManager, mockUpdateUrl, basePrefix);
  });

  describe("hasItem", () => {
    it("should return true when item exists", () => {
      mockDataManager.getCurrentData = vi.fn().mockReturnValue({ foo: "bar" });

      const result = operations.hasItem("foo", {});

      expect(mockDataManager.getCurrentData).toHaveBeenCalledWith(basePrefix);
      expect(result).toBe(true);
    });

    it("should return false when item does not exist", () => {
      mockDataManager.getCurrentData = vi.fn().mockReturnValue({});

      const result = operations.hasItem("nonexistent", {});

      expect(result).toBe(false);
    });

    it("should return false when getCurrentData throws", () => {
      mockDataManager.getCurrentData = vi.fn().mockImplementation(() => {
        throw new QueryStringDriverError("Test error");
      });

      const result = operations.hasItem("foo", {});

      expect(result).toBe(false);
    });
  });

  describe("getItem", () => {
    it("should return item value when it exists", () => {
      mockDataManager.getCurrentData = vi.fn().mockReturnValue({ foo: "bar", num: 123 });

      expect(operations.getItem("foo")).toBe("bar");
      expect(operations.getItem("num")).toBe(123);
    });

    it("should return null when item does not exist", () => {
      mockDataManager.getCurrentData = vi.fn().mockReturnValue({});

      const result = operations.getItem("nonexistent");

      expect(result).toBe(null);
    });

    it("should return null when getCurrentData throws", () => {
      mockDataManager.getCurrentData = vi.fn().mockImplementation(() => {
        throw new QueryStringDriverError("Test error");
      });

      const result = operations.getItem("foo");

      expect(result).toBe(null);
    });

    it("should return null for non-storage values", () => {
      mockDataManager.getCurrentData = vi.fn().mockReturnValue({
        func: () => {},
        symbol: Symbol("test")
      });

      expect(operations.getItem("func")).toBe(null);
      expect(operations.getItem("symbol")).toBe(null);
    });
  });

  describe("getItemRaw", () => {
    it("should return string representation of value", () => {
      mockDataManager.getCurrentData = vi.fn().mockReturnValue({
        foo: "bar",
        num: 123,
        bool: true
      });

      expect(operations.getItemRaw("foo", {})).toBe("bar");
      expect(operations.getItemRaw("num", {})).toBe("123");
      expect(operations.getItemRaw("bool", {})).toBe("true");
    });

    it("should return null when item does not exist", () => {
      mockDataManager.getCurrentData = vi.fn().mockReturnValue({});

      const result = operations.getItemRaw("nonexistent", {});

      expect(result).toBe(null);
    });
  });

  describe("setItem", () => {
    it("should set item and update URL", async () => {
      mockDataManager.getCurrentData = vi.fn().mockReturnValue({ existing: "value" });

      await operations.setItem("newKey", "newValue", {});

      expect(mockUpdateUrl).toHaveBeenCalledWith({
        existing: "value",
        newKey: "newValue"
      });
    });

    it("should remove item when value is null", async () => {
      mockDataManager.getCurrentData = vi.fn().mockReturnValue({
        foo: "bar",
        toRemove: "value"
      });

      // Pass null to exercise the key-removal branch.
      await operations.setItem("toRemove", null, {});

      expect(mockUpdateUrl).toHaveBeenCalledWith({ foo: "bar" });
    });

    it("should handle errors when getCurrentData fails", async () => {
      mockDataManager.getCurrentData = vi.fn().mockImplementation(() => {
        throw new QueryStringDriverError("Test error");
      });

      try {
        await operations.setItem("foo", "bar", {});
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(QueryStringDriverError);
        if (error instanceof QueryStringDriverError) {
          expect(error.message).toContain("Failed to set item");
        }
      }
    });
  });

  describe("removeItem", () => {
    it("should remove item and update URL", async () => {
      mockDataManager.getCurrentData = vi.fn().mockReturnValue({
        foo: "bar",
        toRemove: "value"
      });

      await operations.removeItem("toRemove", {});

      expect(mockUpdateUrl).toHaveBeenCalledWith({ foo: "bar" });
    });

    it("should handle errors when getCurrentData fails", async () => {
      mockDataManager.getCurrentData = vi.fn().mockImplementation(() => {
        throw new QueryStringDriverError("Test error");
      });

      try {
        await operations.removeItem("foo", {});
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(QueryStringDriverError);
        if (error instanceof QueryStringDriverError) {
          expect(error.message).toContain("Failed to remove item");
        }
      }
    });
  });

  describe("getKeys", () => {
    it("should return all keys from current data", () => {
      mockDataManager.getCurrentData = vi.fn().mockReturnValue({
        foo: "bar",
        baz: 123,
        bool: true
      });

      const result = operations.getKeys("", {});

      expect(mockDataManager.getCurrentData).toHaveBeenCalledWith(basePrefix);
      expect(result).toEqual(["foo", "baz", "bool"]);
    });

    it("should return empty array when getCurrentData throws", () => {
      mockDataManager.getCurrentData = vi.fn().mockImplementation(() => {
        throw new QueryStringDriverError("Test error");
      });

      const result = operations.getKeys("", {});

      expect(result).toEqual([]);
    });
  });

  describe("clear", () => {
    it("should clear all data by updating URL with empty object", async () => {
      await operations.clear("", {});

      expect(mockUpdateUrl).toHaveBeenCalledWith({});
    });

    it("should handle errors when updateUrl fails", async () => {
      mockUpdateUrl.mockImplementation(() => {
        throw new QueryStringDriverError("Update failed");
      });

      try {
        await operations.clear("", {});
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(QueryStringDriverError);
        if (error instanceof QueryStringDriverError) {
          expect(error.message).toContain("Failed to clear storage");
        }
      }
    });
  });
});
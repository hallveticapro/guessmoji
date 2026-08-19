import { describe, expect, it } from "vitest";
import {
  readCategoryRoundHistory,
  ROUND_HISTORY_STORAGE_KEY,
  writeCategoryRoundHistory,
} from "@/components/game/round-history-storage";

describe("round-history storage", () => {
  it("returns an empty history when storage has no document", () => {
    const storage = createMemoryStorage();

    expect(readCategoryRoundHistory(storage, "animals")).toEqual([]);
  });

  it("returns an empty history for malformed or invalid documents", () => {
    const storage = createMemoryStorage();

    storage.setItem(ROUND_HISTORY_STORAGE_KEY, "not-json");
    expect(readCategoryRoundHistory(storage, "animals")).toEqual([]);

    storage.setItem(
      ROUND_HISTORY_STORAGE_KEY,
      JSON.stringify({ version: 2, categories: { animals: ["cat"] } }),
    );
    expect(readCategoryRoundHistory(storage, "animals")).toEqual([]);

    storage.setItem(
      ROUND_HISTORY_STORAGE_KEY,
      JSON.stringify({ version: 1, categories: { animals: "cat" } }),
    );
    expect(readCategoryRoundHistory(storage, "animals")).toEqual([]);
  });

  it("round-trips category histories", () => {
    const storage = createMemoryStorage();

    writeCategoryRoundHistory(storage, "animals", ["cat", "dog"]);

    expect(readCategoryRoundHistory(storage, "animals")).toEqual(["cat", "dog"]);
  });

  it("swallows storage read and write errors", () => {
    const throwingStorage = {
      getItem() {
        throw new Error("read failed");
      },
      setItem() {
        throw new Error("write failed");
      },
    };

    expect(readCategoryRoundHistory(throwingStorage, "animals")).toEqual([]);
    expect(() =>
      writeCategoryRoundHistory(throwingStorage, "animals", ["cat"]),
    ).not.toThrow();
  });
});

function createMemoryStorage() {
  const values = new Map<string, string>();

  return {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
  };
}

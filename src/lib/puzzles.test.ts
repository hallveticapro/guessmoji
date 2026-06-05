import { describe, expect, it } from "vitest";
import { puzzles } from "@/data/puzzles";
import {
  getCategoryBySlug,
  getPuzzleById,
  getPuzzlesByCategoryId,
  getRandomMix,
  getRandomizedPuzzles,
} from "@/lib/puzzles";

describe("puzzle utilities", () => {
  it("looks up a category by slug", () => {
    expect(getCategoryBySlug("pixar")?.name).toBe("Pixar");
  });

  it("returns undefined for an invalid category slug", () => {
    expect(getCategoryBySlug("not-real")).toBeUndefined();
  });

  it("returns puzzles by category id", () => {
    const pixarPuzzles = getPuzzlesByCategoryId("pixar");

    expect(pixarPuzzles).toHaveLength(10);
    expect(pixarPuzzles.every((puzzle) => puzzle.categoryId === "pixar")).toBe(true);
  });

  it("looks up a puzzle by id", () => {
    expect(getPuzzleById("lion-king")?.answer).toBe("The Lion King");
  });

  it("returns a random mix with the requested count and no duplicate ids", () => {
    const randomMix = getRandomMix(20);
    const uniqueIds = new Set(randomMix.map((puzzle) => puzzle.id));

    expect(randomMix).toHaveLength(20);
    expect(uniqueIds.size).toBe(randomMix.length);
    expect(randomMix.every((puzzle) => puzzle.categoryId !== "random-mix")).toBe(true);
  });

  it("caps random mix at the available unique puzzle count", () => {
    expect(getRandomMix(500)).toHaveLength(puzzles.length);
  });

  it("shuffles without losing or adding puzzles", () => {
    const sample = getPuzzlesByCategoryId("disney-movies");
    const shuffled = getRandomizedPuzzles(sample);

    expect(shuffled).not.toBe(sample);
    expect(shuffled).toHaveLength(sample.length);
    expect(new Set(shuffled.map((puzzle) => puzzle.id))).toEqual(
      new Set(sample.map((puzzle) => puzzle.id)),
    );
  });
});

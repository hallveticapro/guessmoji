import { describe, expect, it } from "vitest";
import { categories } from "@/data/categories";
import { puzzles } from "@/data/puzzles";
import {
  getCategoryBySlug,
  getPuzzlesByCategoryId,
  getRandomMix,
  getRandomizedPuzzles,
  RANDOM_MIX_SESSION_COUNT,
} from "@/lib/puzzles";

describe("puzzle utilities", () => {
  it("includes the expanded category catalog", () => {
    expect(categories.length).toBeGreaterThanOrEqual(60);
  });

  it("keeps every playable category at ten or more puzzles", () => {
    const playableCategories = categories.filter(
      (category) => category.id !== "random-mix",
    );

    expect(
      playableCategories.every(
        (category) => getPuzzlesByCategoryId(category.id).length >= 10,
      ),
    ).toBe(true);
  });

  it("includes hint, details, and fun fact fields for reveal content", () => {
    expect(
      puzzles.every(
        (puzzle) => puzzle.hint && puzzle.details && puzzle.funFact,
      ),
    ).toBe(true);
  });

  it("does not expose generic fallback reveal facts", () => {
    expect(
      puzzles.some((puzzle) => puzzle.funFact?.includes("emoji clues are quick to recognize")),
    ).toBe(false);
    expect(puzzles.some((puzzle) => puzzle.details?.startsWith("Pack:"))).toBe(false);
  });

  it("keeps category ids and slugs unique", () => {
    expect(new Set(categories.map((category) => category.id)).size).toBe(
      categories.length,
    );
    expect(new Set(categories.map((category) => category.slug)).size).toBe(
      categories.length,
    );
  });

  it("keeps puzzle ids unique", () => {
    expect(new Set(puzzles.map((puzzle) => puzzle.id)).size).toBe(puzzles.length);
  });

  it("keeps every non-random puzzle linked to a real category", () => {
    const categoryIds = new Set(categories.map((category) => category.id));

    expect(puzzles.every((puzzle) => categoryIds.has(puzzle.categoryId))).toBe(
      true,
    );
  });

  it("keeps every answer and emoji clue non-empty", () => {
    expect(puzzles.every((puzzle) => puzzle.answer.trim().length > 0)).toBe(true);
    expect(puzzles.every((puzzle) => puzzle.emojis.trim().length > 0)).toBe(true);
  });

  it("documents intentional duplicate answers", () => {
    const allowedDuplicateAnswers = new Set([
      // Movie titles also appear as character-focused entertainment clues.
      "Cinderella",
      "Moana",
      "Mulan",
      "Rapunzel",
      // Character or franchise clues intentionally overlap across entertainment packs.
      "Pokemon",
      "Thor",
      // Review-identified overlaps retained across educational/general packs.
      "Penguin",
      "Fossil",
      "S'mores",
      "Astronaut",
      "Grand Canyon",
      "Yellowstone",
    ]);
    const answersByName = new Map<string, string[]>();

    for (const puzzle of puzzles) {
      const ids = answersByName.get(puzzle.answer) ?? [];
      ids.push(puzzle.id);
      answersByName.set(puzzle.answer, ids);
    }

    const unexpectedDuplicates = [...answersByName]
      .filter(([, ids]) => ids.length > 1)
      .map(([answer]) => answer)
      .filter((answer) => !allowedDuplicateAnswers.has(answer));

    expect(unexpectedDuplicates).toEqual([]);
  });

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

  it("returns a random mix with the requested count and no duplicate ids", () => {
    const randomMix = getRandomMix(RANDOM_MIX_SESSION_COUNT);
    const uniqueIds = new Set(randomMix.map((puzzle) => puzzle.id));

    expect(randomMix).toHaveLength(RANDOM_MIX_SESSION_COUNT);
    expect(uniqueIds.size).toBe(randomMix.length);
    expect(randomMix.every((puzzle) => puzzle.categoryId !== "random-mix")).toBe(true);
  });

  it("caps random mix at the available unique puzzle count", () => {
    expect(getRandomMix(puzzles.length + 100)).toHaveLength(puzzles.length);
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

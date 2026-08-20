import { describe, expect, it } from "vitest";
import { auditedDeckCeilings } from "@/data/auditedDeckCeilings";
import { categories } from "@/data/categories";
import { puzzles } from "@/data/puzzles";
import {
  getCategoryBySlug,
  getPuzzlesByCategoryId,
  getRandomMix,
  getRandomMixPuzzlePool,
  getRandomizedPuzzles,
  RANDOM_MIX_SESSION_COUNT,
} from "@/lib/puzzles";
import { normalizeAnswerForAudit } from "@/lib/clue-audit";
import type { Puzzle } from "@/types/puzzle";

const normalizedAnswerFixture = [
  {
    id: "moana-first",
    answer: "Moana",
    emojis: "🌊",
    categoryId: "fixture-a",
    difficulty: "easy",
  },
  {
    id: "moana-second",
    answer: "MOANA!",
    emojis: "🌊✨",
    categoryId: "fixture-b",
    difficulty: "easy",
  },
] satisfies Puzzle[];

const emptyNormalizedAnswerFixture = [
  {
    id: "empty-answer-first",
    answer: "!!!",
    emojis: "❗",
    categoryId: "fixture-a",
    difficulty: "easy",
  },
  {
    id: "empty-answer-second",
    answer: "???",
    emojis: "❓",
    categoryId: "fixture-b",
    difficulty: "easy",
  },
] satisfies Puzzle[];

describe("puzzle utilities", () => {
  it("includes the expanded category catalog", () => {
    const sourceCategories = categories.filter((category) => category.id !== "random-mix");

    expect(sourceCategories.length).toBeGreaterThan(0);
    expect(categories).toHaveLength(sourceCategories.length + 1);
  });

  it("keeps every playable category at its audited source ceiling", () => {
    const playableCategories = categories.filter(
      (category) => category.id !== "random-mix",
    );

    expect(
      playableCategories.every(
        (category) =>
          getPuzzlesByCategoryId(category.id).length ===
          auditedDeckCeilings[category.id as keyof typeof auditedDeckCeilings],
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

  it("does not expose generic emoji explanation filler", () => {
    expect(
      puzzles.some((puzzle) =>
        puzzle.explanation?.includes("by showing the main visual clues"),
      ),
    ).toBe(false);
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
      "Harry Potter",
      // Expanded entertainment, activity, and object packs intentionally share these answers.
      "Beauty and the Beast",
      "The Bad Guys",
      "Snow White and the Seven Dwarfs",
      "The Lorax",
      "Donkey Kong",
      "Pac-Man",
      "Tetris",
      "Skeleton",
      "Canoe",
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

  it("keeps the derived Random Mix pool unique by normalized answer", () => {
    const randomMixPool = getRandomMixPuzzlePool();
    const nonEmptyNormalizedAnswers = randomMixPool
      .map((puzzle) => normalizeAnswerForAudit(puzzle.answer))
      .filter(Boolean);

    expect(randomMixPool.every((puzzle) => puzzle.categoryId !== "random-mix")).toBe(true);
    expect(new Set(nonEmptyNormalizedAnswers).size).toBe(nonEmptyNormalizedAnswers.length);
    expect(randomMixPool).toHaveLength(1299);
    expect(randomMixPool.length).toBeGreaterThanOrEqual(RANDOM_MIX_SESSION_COUNT);
  });

  it("deduplicates Random Mix by normalized answer and preserves the first source", () => {
    expect(normalizeAnswerForAudit("Moana")).toBe(
      normalizeAnswerForAudit("MOANA!"),
    );
    expect(getRandomMixPuzzlePool(normalizedAnswerFixture).map((puzzle) => puzzle.id)).toEqual([
      "moana-first",
    ]);
  });

  it("documents the intentional Harry Potter character/title duplicate and Random Mix first-source behavior", () => {
    const booksTitle = puzzles.find((puzzle) => puzzle.id === "books-harry-potter");
    const characterCard = getPuzzlesByCategoryId("harry-potter").find(
      (puzzle) => puzzle.answer === "Harry Potter",
    );

    expect(booksTitle).toBeDefined();
    expect(characterCard).toBeDefined();
    expect(normalizeAnswerForAudit(booksTitle?.answer ?? "")).toBe("harry potter");
    expect(normalizeAnswerForAudit(characterCard?.answer ?? "")).toBe("harry potter");
    expect(booksTitle?.categoryId).toBe("books");
    expect(characterCard?.categoryId).toBe("harry-potter");
    expect(booksTitle?.details).toContain("Published: 1997");
    expect(characterCard?.details).toMatch(/Central protagonist|Gryffindor student/i);
    expect(booksTitle?.emojis).not.toBe(characterCard?.emojis);
    expect(getRandomMixPuzzlePool([booksTitle as Puzzle, characterCard as Puzzle]).map((puzzle) => puzzle.id)).toEqual([
      "books-harry-potter",
    ]);
    expect(getRandomMixPuzzlePool([characterCard as Puzzle, booksTitle as Puzzle]).map((puzzle) => puzzle.id)).toEqual([
      "harry-potter-harry-potter",
    ]);
    expect(
      getRandomMixPuzzlePool().filter(
        (puzzle) => normalizeAnswerForAudit(puzzle.answer) === "harry potter",
      ).map((puzzle) => puzzle.id),
    ).toEqual(["books-harry-potter"]);
  });

  it("preserves every Random Mix card whose normalized answer is empty", () => {
    expect(normalizeAnswerForAudit("!!!")).toBe("");
    expect(normalizeAnswerForAudit("???")).toBe("");
    expect(getRandomMixPuzzlePool(emptyNormalizedAnswerFixture).map((puzzle) => puzzle.id)).toEqual([
      "empty-answer-first",
      "empty-answer-second",
    ]);
  });

  it("caps random mix at the available unique puzzle count", () => {
    expect(getRandomMix(puzzles.length + 100)).toHaveLength(
      getRandomMixPuzzlePool().length,
    );
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

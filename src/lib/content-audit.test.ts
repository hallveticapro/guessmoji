import { describe, expect, it } from "vitest";
import { categories } from "@/data/categories";
import { expandedPuzzles } from "@/data/expandedPacks";
import { puzzles } from "@/data/puzzles";
import { findContentInvariantViolations, getCategoryEmojiUsage } from "@/lib/content-audit";
import type { Category, Puzzle } from "@/types/puzzle";

function makeCategory(id = "category-a"): Category {
  return {
    id,
    name: id,
    slug: id,
    description: "Synthetic category for audit fixtures.",
  };
}

function makePuzzle(overrides: Partial<Puzzle> = {}): Puzzle {
  return {
    id: "puzzle-1",
    answer: "Answer 1",
    emojis: "🌟",
    categoryId: "category-a",
    difficulty: "easy",
    hint: "A useful hint.",
    details: "Useful details.",
    explanation: "The clue explains the answer.",
    funFact: "A useful fact.",
    tags: ["synthetic"],
    ...overrides,
  };
}

function makePuzzles(count: number, overrides: Partial<Puzzle> = {}): Puzzle[] {
  return Array.from({ length: count }, (_, index) =>
    makePuzzle({
      id: `puzzle-${index + 1}`,
      answer: `Answer ${index + 1}`,
      emojis: `🌟${index + 1}`,
      ...overrides,
    }),
  );
}

describe("content audit helpers", () => {
  it("reports category pools whose card count is not a multiple of ten", () => {
    const findings = findContentInvariantViolations(
      [makeCategory()],
      makePuzzles(9),
    );

    expect(findings).toContainEqual(
      expect.objectContaining({
        rule: "pool-size-multiple-of-10",
        categoryId: "category-a",
        puzzleIds: makePuzzles(9).map((puzzle) => puzzle.id),
      }),
    );
  });

  it("reports source categories that have no complete ten-card pool", () => {
    expect(findContentInvariantViolations([makeCategory()], [])).toContainEqual(
      expect.objectContaining({
        rule: "pool-size-multiple-of-10",
        categoryId: "category-a",
        puzzleIds: [],
      }),
    );
  });

  it("reports every missing required reveal field on a puzzle", () => {
    const incompletePuzzle = makePuzzle({
      hint: "   ",
      details: undefined,
      explanation: undefined,
      funFact: undefined,
      tags: [],
    });

    const findings = findContentInvariantViolations([makeCategory()], [incompletePuzzle]);

    expect(findings).toContainEqual(
      expect.objectContaining({
        rule: "missing-required-field",
        categoryId: "category-a",
        puzzleIds: ["puzzle-1"],
      }),
    );
    expect(findings.find((finding) => finding.rule === "missing-required-field")?.message).toEqual(
      expect.stringContaining("hint"),
    );
    expect(findings.find((finding) => finding.rule === "missing-required-field")?.message).toEqual(
      expect.stringContaining("funFact"),
    );
  });

  it("reports duplicate clues after variation-selector normalization", () => {
    const duplicateClues = [
      makePuzzle({ id: "first", emojis: "🌊✨" }),
      makePuzzle({ id: "second", answer: "Answer 2", emojis: "🌊️✨" }),
    ];

    expect(findContentInvariantViolations([makeCategory()], duplicateClues)).toContainEqual(
      expect.objectContaining({
        rule: "duplicate-clue",
        categoryId: "category-a",
        puzzleIds: ["first", "second"],
      }),
    );
  });

  it("reports duplicate normalized answers within a category", () => {
    const duplicateAnswers = [
      makePuzzle({ id: "first", answer: "Lilo & Stitch" }),
      makePuzzle({ id: "second", answer: "Lilo and Stitch", emojis: "🌺🏝️" }),
    ];

    expect(findContentInvariantViolations([makeCategory()], duplicateAnswers)).toContainEqual(
      expect.objectContaining({
        rule: "duplicate-normalized-answer",
        categoryId: "category-a",
        puzzleIds: ["first", "second"],
      }),
    );
  });

  it("reports puzzles that reference a category not in the source list", () => {
    const unknownCategoryPuzzle = makePuzzle({ categoryId: "missing-category" });

    expect(findContentInvariantViolations([makeCategory()], [unknownCategoryPuzzle])).toContainEqual(
      expect.objectContaining({
        rule: "unknown-category",
        categoryId: "missing-category",
        puzzleIds: ["puzzle-1"],
      }),
    );
  });

  it("reports a missing answer without crashing duplicate-answer scanning", () => {
    const missingAnswerPuzzle = {
      ...makePuzzle(),
      answer: undefined,
    } as unknown as Puzzle;
    let findings: ReturnType<typeof findContentInvariantViolations> = [];

    expect(() => {
      findings = findContentInvariantViolations([makeCategory()], [missingAnswerPuzzle]);
    }).not.toThrow();
    expect(findings).toContainEqual(
      expect.objectContaining({
        rule: "missing-required-field",
        puzzleIds: ["puzzle-1"],
      }),
    );
  });

  it("reports missing emojis without crashing duplicate-clue scanning", () => {
    const missingEmojisPuzzle = {
      ...makePuzzle(),
      emojis: undefined,
    } as unknown as Puzzle;
    let findings: ReturnType<typeof findContentInvariantViolations> = [];

    expect(() => {
      findings = findContentInvariantViolations([makeCategory()], [missingEmojisPuzzle]);
    }).not.toThrow();
    expect(findings).toContainEqual(
      expect.objectContaining({
        rule: "missing-required-field",
        puzzleIds: ["puzzle-1"],
      }),
    );
  });

  it("does not treat punctuation-only answers as duplicate normalized answers", () => {
    const punctuationAnswers = makePuzzles(10).map((puzzle, index) =>
      index < 2 ? { ...puzzle, answer: "!!!" } : puzzle,
    );

    expect(findContentInvariantViolations([makeCategory()], punctuationAnswers)).toEqual([]);
  });

  it("does not treat variation-selector-only clues as duplicate clues", () => {
    const variationSelectorClues = makePuzzles(10).map((puzzle, index) =>
      index < 2 ? { ...puzzle, emojis: "\uFE0F" } : puzzle,
    );

    expect(findContentInvariantViolations([makeCategory()], variationSelectorClues)).toEqual([]);
  });

  it("counts each emoji once per card and normalizes variation selectors", () => {
    const twentyCards = makePuzzles(20).map((puzzle, index) => ({
      ...puzzle,
      emojis: index < 5 ? "🌊🌊️" : "⭐",
    }));

    expect(getCategoryEmojiUsage(twentyCards).get("🌊")).toEqual({
      count: 5,
      ratio: 0.25,
    });
    expect(getCategoryEmojiUsage(twentyCards).has("🌊️")).toBe(false);
  });

  it("returns no findings for a complete ten-card category", () => {
    expect(findContentInvariantViolations([makeCategory()], makePuzzles(10))).toEqual([]);
  });

  it("keeps every core entertainment source pool in a complete ten-card block", () => {
    const coreCategoryIds = new Set([
      "disney-movies",
      "disney-princesses",
      "pixar",
      "marvel",
      "star-wars",
      "dreamworks",
      "video-game-movies",
      "kid-tv-shows",
      "animated-classics",
    ]);

    const coreFindings = findContentInvariantViolations(categories, puzzles).filter(
      (finding) => finding.categoryId && coreCategoryIds.has(finding.categoryId),
    );

    expect(coreFindings).toEqual([]);
  });

  it("keeps each partition A expanded pool in accepted ten-card blocks", () => {
    const expectedCounts: Record<string, number> = {
      animals: 30,
      "ocean-animals": 10,
      dinosaurs: 10,
      birds: 10,
      bugs: 20,
      fruit: 20,
      vegetables: 20,
      desserts: 10,
      snacks: 10,
      breakfast: 20,
    };

    for (const [categoryId, count] of Object.entries(expectedCounts)) {
      const categoryPuzzles = expandedPuzzles.filter((puzzle) => puzzle.categoryId === categoryId);
      expect(categoryPuzzles, `${categoryId} count`).toHaveLength(count);
      expect(categoryPuzzles.length % 10).toBe(0);
    }
  });

  it("keeps every partition A expanded card fully populated", () => {
    const partitionACategoryIds = new Set([
      "animals",
      "ocean-animals",
      "dinosaurs",
      "birds",
      "bugs",
      "fruit",
      "vegetables",
      "desserts",
      "snacks",
      "breakfast",
    ]);
    expect(
      expandedPuzzles.filter((puzzle) => partitionACategoryIds.has(puzzle.categoryId)).every(
        (puzzle) =>
          puzzle.answer.trim() &&
          puzzle.emojis.trim() &&
          puzzle.hint?.trim() &&
          puzzle.details?.trim() &&
          puzzle.explanation?.trim() &&
          puzzle.funFact?.trim() &&
          puzzle.tags?.length,
      ),
    ).toBe(true);
  });

  it("keeps every partition B expanded card fully populated", () => {
    const partitionBCategoryIds = new Set([
      "sports",
      "outdoor-games",
      "board-games",
      "party-games",
      "video-games",
      "arcade-classics",
      "pokemon",
      "minecraft",
      "science",
      "space",
      "weather",
      "math",
      "books",
      "fairy-tales",
      "myths",
      "world-landmarks",
      "us-landmarks",
      "world-geography",
      "vehicles",
      "construction",
    ]);
    const partitionBPuzzles = expandedPuzzles.filter((puzzle) =>
      partitionBCategoryIds.has(puzzle.categoryId),
    );

    expect(partitionBPuzzles).toHaveLength(240);
    expect(
      partitionBPuzzles.every(
        (puzzle) =>
          puzzle.answer.trim() &&
          puzzle.emojis.trim() &&
          puzzle.hint?.trim() &&
          puzzle.details?.trim() &&
          puzzle.explanation?.trim() &&
          puzzle.funFact?.trim() &&
          puzzle.tags?.length,
      ),
    ).toBe(true);
  });

  it("keeps only complete, accepted Partition B expansion blocks", () => {
    const expectedCounts: Record<string, number> = {
      sports: 10,
      "outdoor-games": 10,
      "board-games": 10,
      "party-games": 10,
      "video-games": 10,
      "arcade-classics": 10,
      pokemon: 10,
      minecraft: 10,
      science: 20,
      space: 20,
      weather: 10,
      math: 10,
      books: 10,
      "fairy-tales": 10,
      myths: 20,
      "world-landmarks": 10,
      "us-landmarks": 10,
      "world-geography": 20,
      vehicles: 10,
      construction: 10,
    };

    for (const [categoryId, expectedCount] of Object.entries(expectedCounts)) {
      const categoryPuzzles = expandedPuzzles.filter((puzzle) => puzzle.categoryId === categoryId);
      expect(categoryPuzzles, `${categoryId} count`).toHaveLength(expectedCount);
      expect(categoryPuzzles.length % 10).toBe(0);
    }
  });

  it("keeps every Partition C category at an accepted complete-block count", () => {
    const expectedCounts: Record<string, number> = {
      jobs: 20,
      "music-instruments": 20,
      "music-genres": 10,
      "art-supplies": 10,
      "school-supplies": 10,
      camping: 10,
      "national-parks": 10,
      holidays: 20,
      halloween: 10,
      "winter-holidays": 20,
      "summer-fun": 10,
      "beach-day": 10,
      "amusement-park": 10,
      "around-the-house": 10,
      "kitchen-tools": 10,
      "literal-phrases": 10,
      idioms: 20,
      emotions: 20,
      robots: 20,
      plants: 10,
    };

    const partitionCCategories = categories.filter((category) => category.id in expectedCounts);
    const partitionCPuzzles = expandedPuzzles.filter((puzzle) => puzzle.categoryId in expectedCounts);

    expect(partitionCPuzzles).toHaveLength(270);
    expect(partitionCPuzzles.every((puzzle) => puzzle.explanation?.trim())).toBe(true);
    expect(findContentInvariantViolations(partitionCCategories, partitionCPuzzles)).toEqual([]);

    for (const [categoryId, expectedCount] of Object.entries(expectedCounts)) {
      const categoryPuzzles = partitionCPuzzles.filter((puzzle) => puzzle.categoryId === categoryId);
      expect(categoryPuzzles, `${categoryId} count`).toHaveLength(expectedCount);
      expect(categoryPuzzles.length % 10).toBe(0);
    }
  });
});

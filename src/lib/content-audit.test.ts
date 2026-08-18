import { describe, expect, it } from "vitest";
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
});

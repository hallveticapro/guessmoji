import { describe, expect, it } from "vitest";
import { answerEmojiBanlist } from "@/data/answerEmojiBanlist";
import { auditedDeckCeilings } from "@/data/auditedDeckCeilings";
import { categories } from "@/data/categories";
import { expandedPuzzles } from "@/data/expandedPacks";
import { puzzles } from "@/data/puzzles";
import { findDirectAnswerEmojiLeaks, normalizeAnswerForAudit } from "@/lib/clue-audit";
import { findContentInvariantViolations, getCategoryEmojiUsage } from "@/lib/content-audit";
import { getPuzzlesByCategoryId } from "@/lib/puzzles";
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
  it("locks every source deck to its audited ceiling and catalog tier", () => {
    const sourceCategories = categories.filter((category) => category.id !== "random-mix");
    const sourceCategoryIds = sourceCategories.map((category) => category.id).sort();
    const auditedCategoryIds = Object.keys(auditedDeckCeilings).sort();

    expect(auditedCategoryIds).toEqual(sourceCategoryIds);

    const tierCounts = { 10: 0, 20: 0, 30: 0 };
    for (const category of sourceCategories) {
      const auditedCeiling =
        auditedDeckCeilings[category.id as keyof typeof auditedDeckCeilings];
      const sourcePuzzles = getPuzzlesByCategoryId(category.id);

      expect([10, 20, 30]).toContain(auditedCeiling);
      expect([10, 20, 30]).toContain(sourcePuzzles.length);
      expect(sourcePuzzles).toHaveLength(auditedCeiling);
      expect(sourcePuzzles.length % 10).toBe(0);
      tierCounts[auditedCeiling] += 1;
    }

    expect(tierCounts).toEqual({ 10: 9, 20: 30, 30: 21 });
    expect(puzzles).toHaveLength(1320);
  });

  it("keeps source category, puzzle ID, and normalized-answer invariants intact", () => {
    const sourceCategoryIds = new Set(
      categories
        .filter((category) => category.id !== "random-mix")
        .map((category) => category.id),
    );
    const puzzleIds = new Set<string>();
    const normalizedAnswersByCategory = new Map<string, Set<string>>();

    for (const puzzle of puzzles) {
      expect(sourceCategoryIds.has(puzzle.categoryId), `${puzzle.id} category`).toBe(true);
      expect(puzzleIds.has(puzzle.id), `${puzzle.id} ID`).toBe(false);
      puzzleIds.add(puzzle.id);

      const normalizedAnswer = normalizeAnswerForAudit(puzzle.answer);
      if (!normalizedAnswer) {
        continue;
      }

      const categoryAnswers =
        normalizedAnswersByCategory.get(puzzle.categoryId) ?? new Set<string>();
      expect(categoryAnswers.has(normalizedAnswer), `${puzzle.id} normalized answer`).toBe(false);
      categoryAnswers.add(normalizedAnswer);
      normalizedAnswersByCategory.set(puzzle.categoryId, categoryAnswers);
    }

    expect(puzzleIds).toHaveLength(puzzles.length);
    expect(findContentInvariantViolations(categories, puzzles)).toEqual([]);
  });

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

  it("passes final data-driven invariants for the complete shipped catalog", () => {
    const sourceCategories = categories.filter((category) => category.id !== "random-mix");
    const categoryIds = sourceCategories.map((category) => category.id);
    const categorySlugs = sourceCategories.map((category) => category.slug);
    const puzzleIds = puzzles.map((puzzle) => puzzle.id);

    expect(sourceCategories.length).toBeGreaterThan(0);
    expect(new Set(categoryIds).size).toBe(categoryIds.length);
    expect(new Set(categorySlugs).size).toBe(categorySlugs.length);
    expect(new Set(puzzleIds).size).toBe(puzzleIds.length);
    expect(puzzles.every((puzzle) => puzzle.categoryId !== "random-mix")).toBe(true);
    expect(
      puzzles.every(
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

    for (const category of sourceCategories) {
      const categoryPuzzles = getPuzzlesByCategoryId(category.id);
      expect(categoryPuzzles, `${category.id} audited count`).toHaveLength(
        auditedDeckCeilings[category.id as keyof typeof auditedDeckCeilings],
      );
    }

    expect(findContentInvariantViolations(categories, puzzles)).toEqual([]);
  });

  it("keeps each partition A expanded pool in accepted ten-card blocks", () => {
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

    for (const categoryId of partitionACategoryIds) {
      const categoryPuzzles = expandedPuzzles.filter((puzzle) => puzzle.categoryId === categoryId);
      expect(categoryPuzzles, `${categoryId} audited count`).toHaveLength(
        auditedDeckCeilings[categoryId as keyof typeof auditedDeckCeilings],
      );
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

    expect(partitionBPuzzles.length).toBe(
      [...partitionBCategoryIds].reduce(
        (total, categoryId) =>
          total + auditedDeckCeilings[categoryId as keyof typeof auditedDeckCeilings],
        0,
      ),
    );
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

    for (const categoryId of partitionBCategoryIds) {
      const categoryPuzzles = expandedPuzzles.filter((puzzle) => puzzle.categoryId === categoryId);
      expect(categoryPuzzles, `${categoryId} audited count`).toHaveLength(
        auditedDeckCeilings[categoryId as keyof typeof auditedDeckCeilings],
      );
    }
  });

  it("keeps every Partition C category at an accepted complete-block count", () => {
    const partitionCCategoryIds = new Set([
      "jobs",
      "music-instruments",
      "music-genres",
      "art-supplies",
      "school-supplies",
      "camping",
      "national-parks",
      "holidays",
      "halloween",
      "winter-holidays",
      "summer-fun",
      "beach-day",
      "amusement-park",
      "around-the-house",
      "kitchen-tools",
      "literal-phrases",
      "idioms",
      "emotions",
      "robots",
      "plants",
    ]);

    const partitionCCategories = categories.filter((category) =>
      partitionCCategoryIds.has(category.id),
    );
    const partitionCPuzzles = expandedPuzzles.filter((puzzle) =>
      partitionCCategoryIds.has(puzzle.categoryId),
    );

    expect(partitionCPuzzles.length).toBe(
      [...partitionCCategoryIds].reduce(
        (total, categoryId) =>
          total + auditedDeckCeilings[categoryId as keyof typeof auditedDeckCeilings],
        0,
      ),
    );
    expect(partitionCPuzzles.every((puzzle) => puzzle.explanation?.trim())).toBe(true);
    expect(findContentInvariantViolations(partitionCCategories, partitionCPuzzles)).toEqual([]);

    for (const categoryId of partitionCCategoryIds) {
      const categoryPuzzles = partitionCPuzzles.filter((puzzle) => puzzle.categoryId === categoryId);
      expect(categoryPuzzles, `${categoryId} audited count`).toHaveLength(
        auditedDeckCeilings[categoryId as keyof typeof auditedDeckCeilings],
      );
    }
  });

  it("documents the hard Literal Phrases and Idioms category boundary", () => {
    const literalPhrases = categories.find((category) => category.id === "literal-phrases");
    const idioms = categories.find((category) => category.id === "idioms");

    expect(literalPhrases?.description).toMatch(/familiar|pictured word for word|playful/i);
    expect(literalPhrases?.description).not.toMatch(/lexicalized|carve-out|standalone noun/i);
    for (const answer of ["Couch Potato", "Heart of Gold", "Time Flies"]) {
      expect(literalPhrases?.description).not.toMatch(new RegExp(answer, "i"));
    }
    expect(literalPhrases?.description).toMatch(/exclude|not include|belong in Idioms|not a conventional idiom/i);
    expect(idioms?.description).toMatch(/conventional|figurative|idiom/i);
    expect(idioms?.description).toMatch(/exclude|not include|not a literal phrase/i);
  });

  it("ships the exact audited Harry Potter card block with complete reveal fields", () => {
    const category = categories.find((item) => item.id === "harry-potter");
    const harryPotterCards = expandedPuzzles.filter((puzzle) => puzzle.categoryId === "harry-potter");
    const expectedAnswers = [
      "Harry Potter",
      "Hermione Granger",
      "Ron Weasley",
      "Albus Dumbledore",
      "Rubeus Hagrid",
      "Hogwarts",
      "Diagon Alley",
      "Hogsmeade",
      "Platform Nine and Three-Quarters",
      "The Hogwarts Express",
      "The Sorting Hat",
      "Golden Snitch",
      "The Invisibility Cloak",
      "Dobby",
      "Hedwig",
      "Quidditch",
      "Gryffindor",
      "Patronus",
      "Triwizard Tournament",
      "The Deathly Hallows",
      "Severus Snape",
      "Draco Malfoy",
      "Sirius Black",
      "Luna Lovegood",
      "Neville Longbottom",
      "Lord Voldemort",
      "Minerva McGonagall",
      "Fawkes",
      "Marauder’s Map",
      "Elder Wand",
    ];

    expect(category).toMatchObject({
      id: "harry-potter",
      name: "Harry Potter",
      slug: "harry-potter",
      description: "Recognizable characters, places, objects, creatures, and story ideas from the core Harry Potter saga.",
      icon: "⚡",
      colorTheme: "indigo",
      recommendedGradeBand: "3-8",
    });
    expect(harryPotterCards.map((puzzle) => puzzle.answer)).toEqual(expectedAnswers);
    expect(new Set(harryPotterCards.map((puzzle) => puzzle.id)).size).toBe(30);
    expect(new Set(harryPotterCards.map((puzzle) => puzzle.answer))).toHaveLength(30);
    expect(harryPotterCards.every((puzzle) =>
      puzzle.answer.trim() &&
      puzzle.emojis.trim() &&
      puzzle.hint?.trim() &&
      puzzle.details?.trim() &&
      puzzle.explanation?.trim() &&
      puzzle.funFact?.trim() &&
      puzzle.tags?.length,
    )).toBe(true);
    expect(harryPotterCards.filter((puzzle) => puzzle.difficulty === "easy")).toHaveLength(17);
    expect(harryPotterCards.filter((puzzle) => puzzle.difficulty === "medium")).toHaveLength(13);
    expect(harryPotterCards.filter((puzzle) => puzzle.difficulty === "hard")).toHaveLength(0);

    const subthemeCounts = new Map<string, number>();
    for (const puzzle of harryPotterCards) {
      const subtheme = puzzle.tags?.find((tag) =>
        ["characters", "locations", "objects", "concepts", "creatures"].includes(tag),
      );
      expect(subtheme, `${puzzle.id} should carry one Harry Potter subtheme`).toBeDefined();
      subthemeCounts.set(subtheme as string, (subthemeCounts.get(subtheme as string) ?? 0) + 1);
    }
    expect(Object.fromEntries(subthemeCounts)).toEqual({
      characters: 12,
      locations: 5,
      objects: 7,
      concepts: 5,
      creatures: 1,
    });

    const forbiddenScopeText = [
      "fantastic beasts",
      "cursed child",
      "daniel radcliffe",
      "emma watson",
      "rupert grint",
      "j. k. rowling",
      "warner bros",
      "film set",
      "director",
      "newt scamander",
    ];
    for (const puzzle of harryPotterCards) {
      const searchableText = JSON.stringify(puzzle).toLowerCase();
      for (const forbiddenTerm of forbiddenScopeText) {
        expect(searchableText, `${puzzle.id} should remain inside the core saga scope`).not.toContain(
          forbiddenTerm,
        );
      }
    }
  });

  it("keeps Harry Potter clues free of category-context glyphs and direct/component leaks", () => {
    const harryPotterCards = expandedPuzzles.filter((puzzle) => puzzle.categoryId === "harry-potter");
    const categoryContextBans = ["⚡", "🪄", "🏰", "🧙", "🧙‍♂️", "🧙‍♀️"];

    expect(findDirectAnswerEmojiLeaks(harryPotterCards, answerEmojiBanlist)).toEqual([]);
    for (const puzzle of harryPotterCards) {
      for (const bannedEmoji of categoryContextBans) {
        expect(puzzle.emojis, `${puzzle.id} should not use category-context ${bannedEmoji}`).not.toContain(
          bannedEmoji,
        );
      }
    }
    const snitch = harryPotterCards.find((puzzle) => puzzle.id === "harry-potter-golden-snitch");
    expect(snitch?.emojis).toContain("✨");
    expect(snitch?.explanation).toContain("sparkling golden association");
  });

  it("keeps Harry Potter clues distinct and within the normalized repetition budget", () => {
    const harryPotterCards = expandedPuzzles.filter((puzzle) => puzzle.categoryId === "harry-potter");
    const usage = getCategoryEmojiUsage(harryPotterCards);

    expect(new Set(harryPotterCards.map((puzzle) => puzzle.emojis)).size).toBe(30);
    expect([...usage.values()].every(({ count }) => count <= 6)).toBe(true);
    expect(usage.get("🛡") ?? usage.get("🛡️")).toEqual({ count: 6, ratio: 0.2 });
    expect(harryPotterCards.every((puzzle) => !puzzle.emojis.includes("\n"))).toBe(true);
  });

  it("keeps the Task 8 fix-round facts and Snitch/Quidditch clues pairwise distinct", () => {
    const puzzleById = new Map(expandedPuzzles.map((puzzle) => [puzzle.id, puzzle]));
    const dumbledore = puzzleById.get("harry-potter-albus-dumbledore");
    const snitch = puzzleById.get("harry-potter-golden-snitch");
    const quidditch = puzzleById.get("harry-potter-quidditch");

    expect(dumbledore?.funFact).toBe(
      "Dumbledore was known for his alchemy work with Nicolas Flamel.",
    );
    expect(dumbledore?.funFact).not.toMatch(/develop.*Philosopher's Stone/i);
    expect(snitch?.emojis).toBe("✨🪽🔎🤏");
    expect(quidditch?.emojis).toBe("🧹7️⃣🥅📣");
    expect(snitch?.explanation).toMatch(/150 points/i);
    expect(snitch?.explanation).toMatch(/usually ends the match/i);
    expect(snitch?.explanation).toMatch(/can still win without catching it/i);
    expect(snitch?.explanation).not.toMatch(/match-winning|guarantee/i);
    expect(quidditch?.explanation).not.toMatch(/search|Seeker|troph|Golden Snitch/i);
    for (const emoji of ["🧹", "7️⃣", "🥅", "📣"]) {
      expect(snitch?.emojis).not.toContain(emoji);
    }
    for (const emoji of ["✨", "🪽", "🔎", "🤏"]) {
      expect(quidditch?.emojis).not.toContain(emoji);
    }
  });
});

import { normalizeAnswerForAudit } from "@/lib/clue-audit";
import type { Category, Puzzle } from "@/types/puzzle";

const RANDOM_MIX_CATEGORY_ID = "random-mix";
const REQUIRED_FIELDS = [
  "answer",
  "emojis",
  "hint",
  "details",
  "explanation",
  "funFact",
  "tags",
] as const;

export type ContentAuditRule =
  | "pool-size-multiple-of-10"
  | "missing-required-field"
  | "duplicate-clue"
  | "duplicate-normalized-answer"
  | "unknown-category";

export type ContentAuditFinding = {
  rule: ContentAuditRule;
  categoryId?: string;
  puzzleIds: string[];
  message: string;
};

type RequiredField = (typeof REQUIRED_FIELDS)[number];

/**
 * Finds deterministic, machine-checkable problems in a category/puzzle catalog.
 *
 * Random Mix is a derived pool rather than a source category, so it is excluded
 * from source-pool size checks. Duplicate clues and normalized answers are
 * intentionally scoped to a category: the same answer can be valid in two
 * different themed categories.
 */
export function findContentInvariantViolations(
  categoryList: readonly Category[],
  puzzleList: readonly Puzzle[],
): ContentAuditFinding[] {
  const categoryById = new Map(categoryList.map((category) => [category.id, category]));
  const puzzlesByCategory = new Map<string, Puzzle[]>();
  const unknownPuzzleIdsByCategory = new Map<string, string[]>();
  const findings: ContentAuditFinding[] = [];

  for (const puzzle of puzzleList) {
    const categoryPuzzles = puzzlesByCategory.get(puzzle.categoryId) ?? [];
    categoryPuzzles.push(puzzle);
    puzzlesByCategory.set(puzzle.categoryId, categoryPuzzles);

    const unknownCategory = !categoryById.has(puzzle.categoryId);
    if (unknownCategory) {
      const unknownPuzzleIds = unknownPuzzleIdsByCategory.get(puzzle.categoryId) ?? [];
      unknownPuzzleIds.push(puzzle.id);
      unknownPuzzleIdsByCategory.set(puzzle.categoryId, unknownPuzzleIds);
    }

    const missingFields = getMissingRequiredFields(puzzle);
    if (missingFields.length > 0) {
      findings.push({
        rule: "missing-required-field",
        categoryId: puzzle.categoryId,
        puzzleIds: [puzzle.id],
        message: `Puzzle ${puzzle.id} is missing required field(s): ${missingFields.join(", ")}.`,
      });
    }
  }

  for (const [categoryId, puzzleIds] of unknownPuzzleIdsByCategory) {
    findings.push({
      rule: "unknown-category",
      categoryId,
      puzzleIds,
      message: `Puzzle(s) ${puzzleIds.join(", ")} reference unknown category ${categoryId}.`,
    });
  }

  for (const category of categoryList) {
    if (category.id === RANDOM_MIX_CATEGORY_ID) {
      continue;
    }

    const categoryPuzzles = puzzlesByCategory.get(category.id) ?? [];
    if (categoryPuzzles.length < 10 || categoryPuzzles.length % 10 !== 0) {
      findings.push({
        rule: "pool-size-multiple-of-10",
        categoryId: category.id,
        puzzleIds: categoryPuzzles.map((puzzle) => puzzle.id),
        message: `Category ${category.id} contains ${categoryPuzzles.length} puzzle(s); source pools must contain at least 10 cards in complete multiples of 10.`,
      });
    }

    findings.push(...findDuplicateFindings(category.id, categoryPuzzles, "clue"));
    findings.push(...findDuplicateFindings(category.id, categoryPuzzles, "answer"));
  }

  return findings;
}

/**
 * Counts the number of cards containing each emoji and its share of the pool.
 * A repeated emoji on one card counts once, which keeps the ratio useful for
 * category-level repetition review. Variation selectors are ignored so text
 * and emoji presentations of the same glyph share a key.
 */
export function getCategoryEmojiUsage(
  puzzleList: readonly Puzzle[],
): ReadonlyMap<string, { count: number; ratio: number }> {
  const counts = new Map<string, number>();
  const totalCards = puzzleList.length;
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

  for (const puzzle of puzzleList) {
    const emojisOnCard = new Set<string>();

    for (const segment of segmenter.segment(puzzle.emojis)) {
      const emoji = normalizeVariationSelectors(segment.segment);
      if (emoji && isEmojiLike(emoji)) {
        emojisOnCard.add(emoji);
      }
    }

    for (const emoji of emojisOnCard) {
      counts.set(emoji, (counts.get(emoji) ?? 0) + 1);
    }
  }

  return new Map(
    [...counts].map(([emoji, count]) => [emoji, { count, ratio: totalCards === 0 ? 0 : count / totalCards }]),
  );
}

function getMissingRequiredFields(puzzle: Puzzle): RequiredField[] {
  return REQUIRED_FIELDS.filter((field) => {
    if (field === "tags") {
      return (
        !Array.isArray(puzzle.tags) ||
        puzzle.tags.length === 0 ||
        puzzle.tags.every((tag) => typeof tag !== "string" || !tag.trim())
      );
    }

    const value = puzzle[field];
    return typeof value !== "string" || value.trim().length === 0;
  });
}

function findDuplicateFindings(
  categoryId: string,
  categoryPuzzles: readonly Puzzle[],
  duplicateType: "clue" | "answer",
): ContentAuditFinding[] {
  const valuesByKey = new Map<string, Puzzle[]>();

  for (const puzzle of categoryPuzzles) {
    const rawValue = duplicateType === "clue" ? puzzle.emojis : puzzle.answer;
    if (typeof rawValue !== "string" || !rawValue.trim()) {
      continue;
    }
    const value =
      duplicateType === "clue"
        ? normalizeVariationSelectors(rawValue)
        : normalizeAnswerForAudit(rawValue);
    if (!value.trim()) {
      continue;
    }

    const matchingPuzzles = valuesByKey.get(value) ?? [];
    matchingPuzzles.push(puzzle);
    valuesByKey.set(value, matchingPuzzles);
  }

  const rule: ContentAuditRule =
    duplicateType === "clue" ? "duplicate-clue" : "duplicate-normalized-answer";
  const label = duplicateType === "clue" ? "clue" : "normalized answer";

  return [...valuesByKey]
    .filter(([, matchingPuzzles]) => matchingPuzzles.length > 1)
    .map(([value, matchingPuzzles]) => ({
      rule,
      categoryId,
      puzzleIds: matchingPuzzles.map((puzzle) => puzzle.id),
      message: `Category ${categoryId} repeats ${label} ${JSON.stringify(value)} on puzzle(s) ${matchingPuzzles
        .map((puzzle) => puzzle.id)
        .join(", ")}.`,
    }));
}

function normalizeVariationSelectors(value: string): string {
  return value.replace(/[\uFE0E\uFE0F]/g, "");
}

function isEmojiLike(value: string): boolean {
  return /[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Regional_Indicator}\u20E3]/u.test(
    value,
  );
}

import type { Category, Puzzle, PuzzleDifficulty } from "@/types/puzzle";

const RANDOM_MIX_CATEGORY_ID = "random-mix";
const PARTITION_IDS = ["partition-a", "partition-b", "partition-c"] as const;

export type ContentAuditCard = {
  opaqueId: string;
  categoryId: string;
  categoryName: string;
  gradeBand?: string;
  difficulty: PuzzleDifficulty;
  emojis: string;
};

export type FullContentAuditCard = ContentAuditCard & {
  answer: string;
  hint?: string;
  details?: string;
  explanation?: string;
  funFact?: string;
  tags?: string[];
};

export type ContentAuditPartition = {
  id: (typeof PARTITION_IDS)[number];
  categoryIds: string[];
  blindCards: ContentAuditCard[];
  hintsByOpaqueId: Record<string, string>;
  fullCards: FullContentAuditCard[];
};

type PartitionState = ContentAuditPartition & { cardCount: number };
type CategoryRange = { start: number; end: number };

/**
 * Builds deterministic, category-aligned audit packets. Source categories are
 * split into contiguous, balanced ranges so each reviewer receives a stable
 * slice of the catalog. Cards within a category retain puzzle source order, and
 * generated IDs contain no answer or source puzzle ID.
 */
export function buildContentAuditPartitions(
  categoryList: readonly Category[],
  puzzleList: readonly Puzzle[],
  partitionCount = PARTITION_IDS.length,
): ContentAuditPartition[] {
  if (partitionCount !== PARTITION_IDS.length) {
    throw new Error(`Content audit packets require exactly ${PARTITION_IDS.length} partitions.`);
  }

  const sourceCategories = categoryList.filter(
    (category) => category.id !== RANDOM_MIX_CATEGORY_ID,
  );
  const sourcePuzzles = puzzleList.filter(
    (puzzle) => puzzle.categoryId !== RANDOM_MIX_CATEGORY_ID,
  );
  const categoryById = new Map(sourceCategories.map((category) => [category.id, category]));
  const unknownCategoryIds = [...new Set(
    sourcePuzzles
      .filter((puzzle) => !categoryById.has(puzzle.categoryId))
      .map((puzzle) => puzzle.categoryId),
  )];

  if (unknownCategoryIds.length > 0) {
    throw new Error(
      `Cannot build content audit packets for unknown category ID(s): ${unknownCategoryIds.join(", ")}.`,
    );
  }

  const partitions: PartitionState[] = PARTITION_IDS.map((id) => ({
    id,
    categoryIds: [],
    blindCards: [],
    hintsByOpaqueId: {},
    fullCards: [],
    cardCount: 0,
  }));
  let nextOpaqueNumber = 1;
  const categoryRanges = getContiguousCategoryRanges(sourceCategories, sourcePuzzles);

  for (const [partitionIndex, range] of categoryRanges.entries()) {
    const partition = partitions[partitionIndex];
    for (const category of sourceCategories.slice(range.start, range.end)) {
      const categoryPuzzles = sourcePuzzles.filter(
        (puzzle) => puzzle.categoryId === category.id,
      );

      partition.categoryIds.push(category.id);

      for (const puzzle of categoryPuzzles) {
        const opaqueId = `audit-card-${String(nextOpaqueNumber).padStart(4, "0")}`;
        nextOpaqueNumber += 1;
        const baseCard: ContentAuditCard = {
          opaqueId,
          categoryId: category.id,
          categoryName: category.name,
          ...(category.recommendedGradeBand
            ? { gradeBand: category.recommendedGradeBand }
            : {}),
          difficulty: puzzle.difficulty,
          emojis: puzzle.emojis,
        };
        const fullCard = createFullCard(baseCard, puzzle);

        partition.blindCards.push(baseCard);
        partition.fullCards.push(fullCard);
        partition.hintsByOpaqueId[opaqueId] = puzzle.hint ?? "";
        partition.cardCount += 1;
      }
    }
  }

  return partitions.map((partition) => ({
    id: partition.id,
    categoryIds: partition.categoryIds,
    blindCards: partition.blindCards,
    hintsByOpaqueId: partition.hintsByOpaqueId,
    fullCards: partition.fullCards,
  }));
}

function getContiguousCategoryRanges(
  categoryList: readonly Category[],
  puzzleList: readonly Puzzle[],
): CategoryRange[] {
  const partitionCount = PARTITION_IDS.length;
  const categoryCount = categoryList.length;

  if (categoryCount < partitionCount) {
    let nextCategory = 0;
    return Array.from({ length: partitionCount }, () => {
      if (nextCategory >= categoryCount) {
        return { start: categoryCount, end: categoryCount };
      }

      const range = { start: nextCategory, end: nextCategory + 1 };
      nextCategory += 1;
      return range;
    });
  }

  const prefixCardCounts = [0];
  for (const category of categoryList) {
    const cardCount = puzzleList.filter((puzzle) => puzzle.categoryId === category.id).length;
    prefixCardCounts.push(prefixCardCounts[prefixCardCounts.length - 1] + cardCount);
  }

  const totalCardCount = prefixCardCounts[prefixCardCounts.length - 1];
  const ranges: CategoryRange[] = [];
  let start = 0;

  for (let partitionIndex = 0; partitionIndex < partitionCount - 1; partitionIndex += 1) {
    const remainingPartitions = partitionCount - partitionIndex;
    const minimumEnd = start + 1;
    const maximumEnd = categoryCount - (remainingPartitions - 1);
    const targetCumulativeCount = (totalCardCount * (partitionIndex + 1)) / partitionCount;
    let bestEnd = minimumEnd;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let candidateEnd = minimumEnd; candidateEnd <= maximumEnd; candidateEnd += 1) {
      const candidateDistance = Math.abs(
        prefixCardCounts[candidateEnd] - targetCumulativeCount,
      );
      if (candidateDistance < bestDistance) {
        bestEnd = candidateEnd;
        bestDistance = candidateDistance;
      }
    }

    ranges.push({ start, end: bestEnd });
    start = bestEnd;
  }

  ranges.push({ start, end: categoryCount });
  return ranges;
}

function createFullCard(baseCard: ContentAuditCard, puzzle: Puzzle): FullContentAuditCard {
  return {
    ...baseCard,
    answer: puzzle.answer,
    ...(puzzle.hint !== undefined ? { hint: puzzle.hint } : {}),
    ...(puzzle.details !== undefined ? { details: puzzle.details } : {}),
    ...(puzzle.explanation !== undefined ? { explanation: puzzle.explanation } : {}),
    ...(puzzle.funFact !== undefined ? { funFact: puzzle.funFact } : {}),
    ...(puzzle.tags !== undefined ? { tags: [...puzzle.tags] } : {}),
  };
}

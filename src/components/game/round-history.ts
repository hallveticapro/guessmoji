import type { Puzzle } from "@/types/puzzle";

export const SOURCE_CATEGORY_ROUND_COUNT = 10;

export type CategoryRoundSelection = {
  puzzles: Puzzle[];
  seenIds: string[];
  didResetCycle: boolean;
};

export function normalizeSeenPuzzleIds(
  storedIds: readonly string[],
  puzzlePool: readonly Puzzle[],
): string[] {
  const poolIds = new Set(puzzlePool.map((puzzle) => puzzle.id));
  const normalizedIds: string[] = [];
  const seenIds = new Set<string>();

  for (const id of storedIds) {
    if (!poolIds.has(id) || seenIds.has(id)) {
      continue;
    }

    seenIds.add(id);
    normalizedIds.push(id);
  }

  return normalizedIds;
}

export function selectCategoryRound(
  puzzlePool: readonly Puzzle[],
  seenIds: readonly string[],
  count = SOURCE_CATEGORY_ROUND_COUNT,
  random: () => number = Math.random,
): CategoryRoundSelection {
  const uniquePool = uniquePuzzlesById(puzzlePool);
  const normalizedSeenIds = normalizeSeenPuzzleIds(seenIds, uniquePool);
  const poolIds = uniquePool.map((puzzle) => puzzle.id);
  const seenIdSet = new Set(normalizedSeenIds);
  const didResetCycle =
    poolIds.length > 0 && poolIds.every((id) => seenIdSet.has(id));
  const cycleSeenIds = didResetCycle ? [] : normalizedSeenIds;
  const cycleSeenIdSet = new Set(cycleSeenIds);
  const unseenPuzzles = uniquePool.filter(
    (puzzle) => !cycleSeenIdSet.has(puzzle.id),
  );

  shuffleWithRandomness(unseenPuzzles, random);

  const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  const selectedPuzzles = unseenPuzzles.slice(0, safeCount);
  const selectedIds = selectedPuzzles.map((puzzle) => puzzle.id);

  return {
    puzzles: selectedPuzzles,
    seenIds: [...cycleSeenIds, ...selectedIds],
    didResetCycle,
  };
}

function uniquePuzzlesById(puzzlePool: readonly Puzzle[]): Puzzle[] {
  const seenIds = new Set<string>();
  const uniquePuzzles: Puzzle[] = [];

  for (const puzzle of puzzlePool) {
    if (seenIds.has(puzzle.id)) {
      continue;
    }

    seenIds.add(puzzle.id);
    uniquePuzzles.push(puzzle);
  }

  return uniquePuzzles;
}

function shuffleWithRandomness(puzzles: Puzzle[], random: () => number): void {
  for (let index = 0; index < puzzles.length - 1; index += 1) {
    const remainingCount = puzzles.length - index;
    const randomValue = random();
    const boundedRandom = Number.isFinite(randomValue)
      ? Math.min(1 - Number.EPSILON, Math.max(0, randomValue))
      : 0;
    const swapIndex = index + Math.floor(boundedRandom * remainingCount);

    [puzzles[index], puzzles[swapIndex]] = [
      puzzles[swapIndex],
      puzzles[index],
    ];
  }
}

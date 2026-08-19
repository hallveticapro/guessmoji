import { describe, expect, it } from "vitest";
import type { Puzzle } from "@/types/puzzle";
import {
  normalizeSeenPuzzleIds,
  selectCategoryRound,
  SOURCE_CATEGORY_ROUND_COUNT,
} from "@/components/game/round-history";

function createPuzzlePool(count: number): Puzzle[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `puzzle-${index + 1}`,
    answer: `Answer ${index + 1}`,
    emojis: "😀",
    categoryId: "fixture",
    difficulty: "easy",
  }));
}

describe("category round history", () => {
  it("selects the first unseen source round and records its IDs", () => {
    const pool = createPuzzlePool(20);
    const firstRound = selectCategoryRound(
      pool,
      [],
      SOURCE_CATEGORY_ROUND_COUNT,
      () => 0,
    );

    expect(firstRound).toMatchObject({
      puzzles: pool.slice(0, 10),
      seenIds: pool.slice(0, 10).map((puzzle) => puzzle.id),
      didResetCycle: false,
    });

    const secondRound = selectCategoryRound(
      pool,
      firstRound.seenIds,
      SOURCE_CATEGORY_ROUND_COUNT,
      () => 0,
    );

    expect(secondRound.puzzles).toEqual(pool.slice(10));
    expect(secondRound.seenIds).toEqual(pool.map((puzzle) => puzzle.id));
  });

  it("resets the cycle before selecting when every pool card was seen", () => {
    const pool = createPuzzlePool(20);
    const allPuzzleIds = pool.map((puzzle) => puzzle.id);

    expect(
      selectCategoryRound(
        pool,
        allPuzzleIds,
        SOURCE_CATEGORY_ROUND_COUNT,
        () => 0,
      ),
    ).toMatchObject({
      puzzles: pool.slice(0, 10),
      seenIds: pool.slice(0, 10).map((puzzle) => puzzle.id),
      didResetCycle: true,
    });
  });

  it("removes stale and repeated stored IDs while preserving valid order", () => {
    const pool = createPuzzlePool(3);

    expect(
      normalizeSeenPuzzleIds(
        [pool[0].id, "stale", pool[0].id, pool[2].id],
        pool,
      ),
    ).toEqual([pool[0].id, pool[2].id]);
  });

  it("returns every card when a pool is smaller than the requested round", () => {
    const pool = createPuzzlePool(3);

    expect(selectCategoryRound(pool, [], 10, () => 0)).toMatchObject({
      puzzles: pool,
      seenIds: pool.map((puzzle) => puzzle.id),
      didResetCycle: false,
    });
  });

  it("does not repeat a puzzle within a round", () => {
    const pool = createPuzzlePool(20);
    const selection = selectCategoryRound(pool, [], 10, () => 0.5);

    expect(new Set(selection.puzzles.map((puzzle) => puzzle.id)).size).toBe(
      selection.puzzles.length,
    );
  });

  it("does not mutate the pool or stored history inputs", () => {
    const pool = createPuzzlePool(20);
    const seenIds = [pool[1].id, pool[3].id];
    const originalPool = [...pool];
    const originalSeenIds = [...seenIds];

    selectCategoryRound(pool, seenIds, 10, () => 0.25);

    expect(pool).toEqual(originalPool);
    expect(seenIds).toEqual(originalSeenIds);
  });
});

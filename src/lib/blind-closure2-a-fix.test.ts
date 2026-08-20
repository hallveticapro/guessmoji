import { describe, expect, it } from "vitest";
import { puzzles } from "@/data/puzzles";
import { normalizeAnswerForAudit } from "@/lib/clue-audit";
import type { Puzzle } from "@/types/puzzle";

const hardCalibrationEvidence = [
  {
    id: "breakfast-english-muffin",
    categoryId: "breakfast",
    answer: "English Muffin",
    preHintGuess: "Toast",
    postHintGuess: "English muffin",
  },
  {
    id: "breakfast-danish-pastry",
    categoryId: "breakfast",
    answer: "Danish Pastry",
    preHintGuess: "Pancakes",
    postHintGuess: "Danish pastry",
  },
  {
    id: "breakfast-biscuit-and-gravy",
    categoryId: "breakfast",
    answer: "Biscuit and Gravy",
    preHintGuess: "Oatmeal",
    postHintGuess: "Biscuits and gravy",
  },
] as const;

function getPuzzle(id: string): Puzzle {
  const puzzle = puzzles.find((candidate) => candidate.id === id);
  expect(puzzle, `${id} should exist`).toBeDefined();
  return puzzle as Puzzle;
}

function normalizeBlindGuess(value: string): string {
  return normalizeAnswerForAudit(value).replace(/\bbiscuits\b/g, "biscuit");
}

describe("closure 2 breakfast hard-card calibration", () => {
  it("uses hard when the category connection is reasonable but the exact answer arrives after the hint", () => {
    expect(hardCalibrationEvidence).toHaveLength(3);
    expect(new Set(hardCalibrationEvidence.map((card) => card.id)).size).toBe(3);

    for (const expected of hardCalibrationEvidence) {
      const puzzle = getPuzzle(expected.id);

      expect(puzzle.categoryId).toBe(expected.categoryId);
      expect(normalizeBlindGuess(expected.preHintGuess)).not.toBe(
        normalizeBlindGuess(expected.answer),
      );
      expect(normalizeBlindGuess(expected.postHintGuess)).toBe(
        normalizeBlindGuess(expected.answer),
      );
      expect(puzzle.difficulty).toBe("hard");
    }
  });
});

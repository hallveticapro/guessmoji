import { describe, expect, it } from "vitest";
import { answerEmojiBanlist } from "@/data/answerEmojiBanlist";
import { categories } from "@/data/categories";
import {
  findDirectAnswerEmojiLeaks,
  normalizeAnswerForAudit,
} from "@/lib/clue-audit";
import { getPuzzlesByCategoryId } from "@/lib/puzzles";
import { puzzles } from "@/data/puzzles";
import type { Puzzle } from "@/types/puzzle";

describe("clue audit helpers", () => {
  it.each([
    ["Fox", "fox"],
    ["  Fox  ", "fox"],
    ["S'mores", "smores"],
    ["Lilo & Stitch", "lilo and stitch"],
    ["Spider-Man", "spider man"],
    ["R2-D2", "r2 d2"],
    ["Grapes", "grapes"],
  ])("normalizes %s for answer-audit matching", (answer, expected) => {
    expect(normalizeAnswerForAudit(answer)).toBe(expected);
  });

  it("includes required direct-answer regression bans", () => {
    expect(answerEmojiBanlist.whale).toContain("🐋");
    expect(answerEmojiBanlist.fox).toContain("🦊");
    expect(answerEmojiBanlist.elephant).toContain("🐘");
    expect(answerEmojiBanlist.giraffe).toContain("🦒");
    expect(answerEmojiBanlist.apple).toEqual(expect.arrayContaining(["🍎", "🍏"]));
    expect(answerEmojiBanlist.carrot).toContain("🥕");
  });

  it("reports structured direct-answer emoji leaks", () => {
    const leakingPuzzle: Puzzle = {
      id: "synthetic-fox",
      answer: "Fox",
      emojis: "🦊🌙🌲",
      categoryId: "animals",
      difficulty: "easy",
    };

    expect(findDirectAnswerEmojiLeaks([leakingPuzzle], answerEmojiBanlist)).toEqual([
      {
        puzzleId: "synthetic-fox",
        answer: "Fox",
        emojis: "🦊🌙🌲",
        forbiddenEmoji: "🦊",
      },
    ]);
  });

  it("keeps shipped puzzle clues free of direct-answer emoji leaks", () => {
    const leaks = findDirectAnswerEmojiLeaks(puzzles, answerEmojiBanlist);

    expect(leaks).toEqual([]);
  });

  it("keeps known animal and food regression clues clean", () => {
    const puzzleByAnswer = new Map(
      puzzles.map((puzzle) => [`${puzzle.categoryId}:${puzzle.answer}`, puzzle]),
    );

    expect(puzzleByAnswer.get("ocean-animals:Whale")?.emojis).not.toContain("🐋");
    expect(puzzleByAnswer.get("animals:Fox")?.emojis).not.toContain("🦊");
    expect(puzzleByAnswer.get("animals:Elephant")?.emojis).not.toContain("🐘");
    expect(puzzleByAnswer.get("animals:Giraffe")?.emojis).not.toContain("🦒");
    expect(puzzleByAnswer.get("fruit:Apple")?.emojis).not.toEqual(
      expect.stringMatching(/🍎|🍏/),
    );
    expect(puzzleByAnswer.get("vegetables:Carrot")?.emojis).not.toContain("🥕");
  });

  it("keeps source categories aligned with shipped puzzle coverage", () => {
    expect(categories).toHaveLength(60);
    expect(puzzles).toHaveLength(600);

    for (const category of categories) {
      if (category.id === "random-mix") {
        expect(getPuzzlesByCategoryId(category.id)).toHaveLength(0);
        continue;
      }

      const sourceCount = getPuzzlesByCategoryId(category.id).length;
      expect(sourceCount, `${category.id} should have source puzzles`).toBeGreaterThan(0);
    }
  });
});

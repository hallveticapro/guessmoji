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

  it("keeps audited core category-context and repetition regressions clean", () => {
    const categoryContextBans: Record<string, string[]> = {
      "disney-movies": ["🎬"],
      "disney-princesses": ["👸"],
      pixar: ["🎬"],
      marvel: ["🦸", "🦸‍♂️", "🦸‍♀️"],
      "star-wars": ["🌌"],
      dreamworks: ["🎬"],
      "video-game-movies": ["🎮", "🎬"],
      "kid-tv-shows": ["📺", "🎬"],
      "animated-classics": ["🎬"],
    };

    for (const [categoryId, bannedEmojis] of Object.entries(categoryContextBans)) {
      for (const puzzle of getPuzzlesByCategoryId(categoryId)) {
        for (const bannedEmoji of bannedEmojis) {
          expect(puzzle.emojis, `${puzzle.id} should not repeat ${bannedEmoji}`).not.toContain(
            bannedEmoji,
          );
        }
      }
    }

    const repetitionCases = [
      ["disney-movies", "🌸"],
      ["disney-princesses", "🏰"],
      ["star-wars", "🚀"],
      ["star-wars", "⚔️"],
      ["video-game-movies", "⚡"],
      ["video-game-movies", "🐭"],
    ] as const;

    for (const [categoryId, emoji] of repetitionCases) {
      const count = getPuzzlesByCategoryId(categoryId).filter((puzzle) =>
        puzzle.emojis.includes(emoji),
      ).length;
      expect(count, `${emoji} should stay at or below the 20% review threshold`).toBeLessThanOrEqual(
        Math.floor(getPuzzlesByCategoryId(categoryId).length * 0.2),
      );
    }
  });

  it("keeps canonical entertainment answers and blind-review repairs shipped", () => {
    const puzzleById = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]));

    expect(puzzleById.get("minecraft-movie")?.answer).toBe("A Minecraft Movie");
    expect(puzzleById.get("pokemon-first-movie")?.answer).toBe(
      "Pokémon: The First Movie",
    );
    expect(puzzleById.get("pokemon-i-choose-you")?.answer).toBe(
      "Pokémon the Movie: I Choose You!",
    );
    expect(puzzleById.get("pokemon-tv")?.answer).toBe("Pokémon");
    expect(puzzleById.get("paw-patrol")?.answer).toBe("PAW Patrol");

    const gabby = puzzleById.get("gabbys-dollhouse");
    expect(gabby?.difficulty).toBe("medium");
    expect(gabby?.emojis).toContain("📦");
    expect(gabby?.hint).toContain("cat-themed");

    const teenTitans = puzzleById.get("teen-titans-go");
    expect(teenTitans?.emojis).toContain("🗼");
    expect(teenTitans?.emojis).toContain("🟣");
    expect(teenTitans?.hint).toContain("Titans Tower");

    expect(puzzleById.get("ralph-breaks-the-internet")?.hint).not.toMatch(
      /Ralph|Vanellope/i,
    );
    expect(puzzleById.get("spongebob-squarepants")?.hint).not.toMatch(
      /square.*sponge|pineapple/i,
    );
    expect(puzzleById.get("secret-life-of-pets")?.hint).not.toMatch(
      /pets.*people leave|people leave.*pets/i,
    );
  });

  it("keeps source categories aligned with shipped puzzle coverage", () => {
    expect(categories.length).toBeGreaterThan(0);
    expect(puzzles.length).toBeGreaterThan(0);

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

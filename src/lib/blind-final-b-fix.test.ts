import { describe, expect, it } from "vitest";
import { answerEmojiBanlist } from "@/data/answerEmojiBanlist";
import { categories } from "@/data/categories";
import { expandedPuzzles } from "@/data/expandedPacks";
import { puzzles } from "@/data/puzzles";
import { findDirectAnswerEmojiLeaks, normalizeAnswerForAudit } from "@/lib/clue-audit";
import { getCategoryEmojiUsage, findContentInvariantViolations } from "@/lib/content-audit";
import type { Puzzle } from "@/types/puzzle";

const repairManifest = [
  {
    id: "books-the-bfg",
    categoryId: "books",
    answer: "The BFG",
    difficulty: "medium",
    emojis: "🧍‍♂️📏💭🫙🗣️",
    hint: "A kind, towering visitor collects dreams in jars and speaks in playful made-up words.",
    details: "Roald Dahl fantasy novel about Sophie and the Big Friendly Giant.",
    funFact: "The BFG's invented vocabulary is called Gobblefunk.",
    tags: ["books", "fantasy", "roald-dahl", "giants"],
    explanation:
      "🧍‍♂️📏 show the visitor's unusual height; 💭 are the dreams; 🫙 holds them; 🗣️ signals the visitor's playful invented speech.",
  },
  {
    id: "world-landmarks-victoria-memorial",
    categoryId: "world-landmarks",
    answer: "Victoria Memorial",
    difficulty: "medium",
    emojis: "🏛️🖼️🇬🇧🇮🇳🌆",
    hint: "A Kolkata museum in formal gardens commemorates a British monarch.",
    details: "Large marble memorial in Kolkata, India, built in memory of Queen Victoria.",
    funFact: "Victoria Memorial opened to the public in 1921 and now houses a museum.",
    tags: ["world-landmarks", "india", "kolkata", "memorial"],
    explanation:
      "🏛️ is the landmark building; 🖼️ signals its museum; 🇬🇧 gives the British royal connection; 🇮🇳 locates India; 🌆 gives the Kolkata city setting.",
  },
  {
    id: "us-landmarks-mount-vernon",
    categoryId: "us-landmarks",
    answer: "Mount Vernon",
    difficulty: "medium",
    emojis: "🌊🌳🏡🪖1️⃣",
    hint: "A Virginia estate beside the Potomac preserves the home of the nation's first president.",
    details: "Historic plantation estate and home of George Washington in Mount Vernon, Virginia.",
    funFact: "Washington lived at Mount Vernon for much of his adult life, and the estate overlooks the Potomac.",
    tags: ["us-landmarks", "virginia", "history", "estate"],
    explanation:
      "🌊 is the Potomac setting; 🌳 are the estate grounds; 🏡 is the preserved residence; 🪖 recalls its owner's Revolutionary-era military service; 1️⃣ marks his role as the nation's first president.",
  },
] as const;

const categoryContextBans: Record<string, readonly string[]> = {
  books: ["📚"],
  "world-landmarks": ["🗺️"],
  "us-landmarks": ["🗽"],
};

function getPuzzle(id: string): Puzzle {
  const puzzle = expandedPuzzles.find((candidate) => candidate.id === id);
  expect(puzzle, `${id} should exist`).toBeDefined();
  return puzzle as Puzzle;
}

function graphemes(value: string): string[] {
  return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value)].map(
    ({ segment }) => segment,
  );
}

function normalizedEmojiSet(value: string): Set<string> {
  return new Set(graphemes(value.replace(/\uFE0F/g, "")));
}

function sharedEmojiCount(first: string, second: string): number {
  const secondSet = normalizedEmojiSet(second);
  return [...normalizedEmojiSet(first)].filter((emoji) => secondSet.has(emoji)).length;
}

function expectHintDoesNotNameAnswer(hint: string, answer: string): void {
  const normalizedHint = ` ${normalizeAnswerForAudit(hint)} `;
  const answerWords = normalizeAnswerForAudit(answer)
    .split(" ")
    .filter((word) => word.length >= 4);

  for (const answerWord of answerWords) {
    expect(normalizedHint).not.toContain(` ${answerWord} `);
  }
}

describe("final partition B blind repair", () => {
  it("applies exactly the three proposed repairs and preserves immutable card fields", () => {
    expect(repairManifest).toHaveLength(3);
    expect(new Set(repairManifest.map((card) => card.id)).size).toBe(3);

    for (const expected of repairManifest) {
      expect(getPuzzle(expected.id)).toMatchObject(expected);
    }
  });

  it("preserves source identity and the affected pool counts", () => {
    expect(expandedPuzzles).toHaveLength(1130);
    expect(puzzles).toHaveLength(1320);
    expect(new Set(expandedPuzzles.map((puzzle) => puzzle.id)).size).toBe(1130);

    for (const expected of repairManifest) {
      const puzzle = getPuzzle(expected.id);
      expect(puzzle.id).toBe(expected.id);
      expect(puzzle.categoryId).toBe(expected.categoryId);
      expect(puzzle.answer).toBe(expected.answer);
      expect(puzzle.difficulty).toBe(expected.difficulty);
      expect(puzzle.details).toBe(expected.details);
      expect(puzzle.funFact).toBe(expected.funFact);
      expect(puzzle.tags).toEqual(expected.tags);
    }

    expect(expandedPuzzles.filter((puzzle) => puzzle.categoryId === "books")).toHaveLength(30);
    expect(expandedPuzzles.filter((puzzle) => puzzle.categoryId === "world-landmarks")).toHaveLength(30);
    expect(expandedPuzzles.filter((puzzle) => puzzle.categoryId === "us-landmarks")).toHaveLength(20);
  });

  it("keeps each repaired clue shaped, leak-free, answer-safe, and fully explained", () => {
    for (const expected of repairManifest) {
      const puzzle = getPuzzle(expected.id);
      const clueGraphemes = graphemes(puzzle.emojis);

      expect(puzzle.emojis, `${expected.id} clue whitespace`).not.toMatch(/\s/u);
      expect(clueGraphemes).toHaveLength(5);
      expect(findDirectAnswerEmojiLeaks([puzzle], answerEmojiBanlist)).toEqual([]);
      expectHintDoesNotNameAnswer(puzzle.hint ?? "", puzzle.answer);
      expect(puzzle.explanation).toBeTruthy();

      for (const emoji of clueGraphemes) {
        expect(puzzle.explanation, `${expected.id} explanation for ${emoji}`).toContain(emoji);
      }
      expect(puzzle.explanation).not.toMatch(/audit|implementation|withheld|generic fallback/i);
    }
  });

  it("keeps repaired clues free of category-context filler and new repetition warnings", () => {
    for (const expected of repairManifest) {
      for (const bannedEmoji of categoryContextBans[expected.categoryId] ?? []) {
        expect(getPuzzle(expected.id).emojis, `${expected.id} context ${bannedEmoji}`).not.toContain(
          bannedEmoji,
        );
      }

      const usage = getCategoryEmojiUsage(
        expandedPuzzles.filter((puzzle) => puzzle.categoryId === expected.categoryId),
      );
      for (const emoji of normalizedEmojiSet(expected.emojis)) {
        expect(usage.get(emoji)?.ratio ?? 0, `${expected.id} repetition ${emoji}`).toBeLessThanOrEqual(0.2);
      }
    }
  });

  it("keeps repaired clues distinct from every same-category neighbor", () => {
    for (const expected of repairManifest) {
      const puzzle = getPuzzle(expected.id);
      const sameCategory = expandedPuzzles.filter(
        (candidate) => candidate.categoryId === puzzle.categoryId && candidate.id !== puzzle.id,
      );

      for (const other of sameCategory) {
        expect(puzzle.emojis, `${puzzle.id}/${other.id} exact clue`).not.toBe(other.emojis);
        expect(
          sharedEmojiCount(puzzle.emojis, other.emojis),
          `${puzzle.id}/${other.id} shared clue glyphs`,
        ).toBeLessThanOrEqual(2);
      }
    }
  });

  it("keeps complete-catalog invariants and direct-answer audits clean", () => {
    expect(findDirectAnswerEmojiLeaks(puzzles, answerEmojiBanlist)).toEqual([]);
    expect(findContentInvariantViolations(categories, puzzles)).toEqual([]);
  });
});

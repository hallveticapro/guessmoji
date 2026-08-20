import { describe, expect, it } from "vitest";
import { answerEmojiBanlist } from "@/data/answerEmojiBanlist";
import { categories } from "@/data/categories";
import { expandedPuzzles } from "@/data/expandedPacks";
import { puzzles } from "@/data/puzzles";
import {
  findDirectAnswerEmojiLeaks,
  normalizeAnswerForAudit,
} from "@/lib/clue-audit";
import { findContentInvariantViolations, getCategoryEmojiUsage } from "@/lib/content-audit";
import type { Puzzle } from "@/types/puzzle";

const repairManifest = [
  {
    id: "star-wars-rey",
    categoryId: "star-wars",
    answer: "Rey",
    difficulty: "medium",
    emojis: "🏜️🪵⚔️👩🧭",
    hint: "A human scavenger from Jakku follows a Jedi path after discovering her place in the Force.",
    explanation:
      "🏜️ places the scavenger on Jakku; 🪵 gives the carried staff; ⚔️ signals the Jedi and lightsaber path; 👩 identifies the human heroine; and 🧭 evokes navigating the wasteland.",
    details: "Star Wars hero introduced in the sequel trilogy who becomes a Jedi.",
    funFact: "Rey first appears in The Force Awakens, played by Daisy Ridley.",
    tags: ["star-wars", "jedi", "film"],
  },
  {
    id: "ocean-animals-seal",
    categoryId: "ocean-animals",
    answer: "Seal",
    difficulty: "medium",
    emojis: "🧊🛌🔘📣🫧",
    hint: "A spotted marine mammal rests on ice and makes a barking call.",
    explanation:
      "🧊 gives the icy haul-out; 🛌 shows resting on the ice; 🔘 suggests the spotted coat; 📣 evokes the barking call; and 🫧 shows dives beneath the surface.",
    details: "Marine mammal that uses flippers to swim and often rests on shore or ice.",
    funFact: "Many seals can slow their heart rate during dives to conserve oxygen.",
    tags: ["ocean-animals", "mammal"],
  },
  {
    id: "breakfast-english-muffin",
    categoryId: "breakfast",
    answer: "English Muffin",
    difficulty: "hard",
    emojis: "🍞🫧🔪🔥🟤",
    hint: "A round yeast bread splits open to reveal nooks and a coarse surface for toasting.",
    explanation:
      "🍞 gives the bread base; 🫧 evokes the airy nooks; 🔪 shows the split; 🔥 marks toasting; and 🟤 shows the browned, coarse surface.",
    details: "Type: Bread",
    funFact:
      "English muffins are yeast-raised round breads with a coarse-textured surface, commonly split and toasted.",
    tags: ["food", "breakfast"],
  },
  {
    id: "breakfast-danish-pastry",
    categoryId: "breakfast",
    answer: "Danish Pastry",
    difficulty: "hard",
    emojis: "🧈🔁🍯🍓👐",
    hint: "A flaky layered bake holds fruit or cream beneath a glaze.",
    explanation:
      "🧈 evokes the rich dough; 🔁 shows repeated folds that create flaky layers; 🍯 marks the glaze; 🍓 supplies an optional fruit filling; and 👐 shows the hand-held pastry.",
    details: "Sweet laminated yeast pastry associated with Danish baking and often filled or glazed.",
    funFact:
      "Danish pastry developed from Austrian baking techniques brought to Denmark in the nineteenth century.",
    tags: ["breakfast", "baked"],
  },
  {
    id: "breakfast-biscuit-and-gravy",
    categoryId: "breakfast",
    answer: "Biscuit and Gravy",
    difficulty: "hard",
    emojis: "🟤✂️🫗🌶️🥣",
    hint: "A Southern morning plate pairs split baked rounds with a warm pepper-seasoned sauce.",
    explanation:
      "🟤 marks the browned biscuit; ✂️ shows it split open; 🫗 shows gravy poured over it; 🌶️ evokes the peppered savory seasoning; and 🥣 shows the serving bowl.",
    details: "Southern U.S. breakfast of biscuits served with a thick sausage or peppered gravy.",
    funFact:
      "The dish became especially common in the American South because the ingredients were inexpensive and filling.",
    tags: ["breakfast", "savory"],
  },
] as const;

const categoryContextBans: Record<string, readonly string[]> = {
  "star-wars": ["✨"],
  "ocean-animals": ["🌊"],
  breakfast: ["🥞"],
};

function getPuzzle(id: string): Puzzle {
  const puzzle = puzzles.find((candidate) => candidate.id === id);
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

describe("final partition A blind repair", () => {
  it("applies exactly the five proposed repairs and preserves immutable card fields", () => {
    expect(repairManifest).toHaveLength(5);
    expect(new Set(repairManifest.map((card) => card.id)).size).toBe(5);

    for (const expected of repairManifest) {
      expect(getPuzzle(expected.id)).toMatchObject(expected);
    }
  });

  it("preserves source identity, catalog counts, and affected pool counts", () => {
    expect(expandedPuzzles).toHaveLength(1130);
    expect(puzzles).toHaveLength(1320);
    expect(new Set(expandedPuzzles.map((puzzle) => puzzle.id)).size).toBe(1130);
    expect(new Set(puzzles.map((puzzle) => puzzle.id)).size).toBe(1320);

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

    expect(puzzles.filter((puzzle) => puzzle.categoryId === "star-wars")).toHaveLength(30);
    expect(expandedPuzzles.filter((puzzle) => puzzle.categoryId === "ocean-animals")).toHaveLength(20);
    expect(expandedPuzzles.filter((puzzle) => puzzle.categoryId === "breakfast")).toHaveLength(30);
  });

  it("keeps repaired clues shaped, leak-free, answer-safe, and fully explained", () => {
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

  it("keeps repaired clues free of category-context filler and records reviewed repetition warnings", () => {
    const reviewedWarnings: Record<string, readonly string[]> = {
      breakfast: ["🔥"],
    };

    for (const expected of repairManifest) {
      for (const bannedEmoji of categoryContextBans[expected.categoryId] ?? []) {
        expect(getPuzzle(expected.id).emojis, `${expected.id} context ${bannedEmoji}`).not.toContain(
          bannedEmoji,
        );
      }

      const usage = getCategoryEmojiUsage(
        puzzles.filter((puzzle) => puzzle.categoryId === expected.categoryId),
      );
      for (const emoji of normalizedEmojiSet(expected.emojis)) {
        const ratio = usage.get(emoji)?.ratio ?? 0;
        if (ratio > 0.2) {
          expect(
            reviewedWarnings[expected.categoryId] ?? [],
            `${expected.id} repetition ${emoji}`,
          ).toContain(emoji);
        }
      }
    }

    const breakfastUsage = getCategoryEmojiUsage(
      puzzles.filter((puzzle) => puzzle.categoryId === "breakfast"),
    );
    expect(breakfastUsage.get("🔥")).toEqual({ count: 7, ratio: 7 / 30 });
  });

  it("keeps repaired clues distinct from every same-category neighbor", () => {
    for (const expected of repairManifest) {
      const puzzle = getPuzzle(expected.id);
      const sameCategory = puzzles.filter(
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

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

const finalCalibrationManifest = [
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
    id: "vegetables-celery",
    categoryId: "vegetables",
    answer: "Celery",
    difficulty: "easy",
    emojis: "📏🌿🧵🥗",
    hint: "A leafy-topped stalk has stringy ribs and a crisp, watery bite.",
    explanation:
      "📏 gives the long stalk; 🌿 supplies its leafy top; 🧵 shows the stringy ribs; and 🥗 evokes the raw salad or snack use of the crisp stalk.",
    details: "Type: Stalk vegetable",
    funFact: "Celery has long fibrous stalks and is mostly water.",
    tags: ["food", "vegetables"],
  },
  {
    id: "desserts-cupcake",
    categoryId: "desserts",
    answer: "Cupcake",
    difficulty: "easy",
    emojis: "📄🌀🕯️🤏",
    hint: "A single frosted bake rises in a pleated paper liner.",
    explanation:
      "📄 is the pleated paper liner; 🌀 gives the frosting swirl; 🕯️ evokes a celebratory topping; and 🤏 emphasizes the small individual portion.",
    details: "Type: Baked dessert",
    funFact: "Cupcakes became popular because they bake quickly in small cups.",
    tags: ["food", "dessert", "desserts"],
  },
  {
    id: "breakfast-breakfast-sandwich",
    categoryId: "breakfast",
    answer: "Breakfast Sandwich",
    difficulty: "easy",
    emojis: "🥚🍞🧀🤲",
    hint: "A warm morning meal places a cooked egg and savory filling between bread layers for eating by hand.",
    explanation:
      "🥚 gives the cooked egg; 🍞 supplies the bread layers; 🧀 gives a savory filling; and 🤲 marks the handheld serving format.",
    details: "Type: Breakfast dish",
    funFact: "Breakfast sandwiches often combine eggs with cheese and a bread or biscuit.",
    tags: ["food", "breakfast"],
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
  "ocean-animals": ["🌊"],
  vegetables: ["🥕"],
  desserts: ["🍰"],
  breakfast: ["🥞"],
};

function getPuzzle(id: string) {
  const puzzle = puzzles.find((candidate) => candidate.id === id);
  expect(puzzle, `${id} should exist`).toBeDefined();
  return puzzle!;
}

function graphemes(value: string): string[] {
  return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value)].map(
    ({ segment }) => segment,
  );
}

function normalizedEmojiSet(value: string): Set<string> {
  return new Set(graphemes(value.replace(/\uFE0F/g, "")));
}

function expectHintDoesNotNameAnswer(hint: string | undefined, answer: string): void {
  const normalizedHint = ` ${normalizeAnswerForAudit(hint ?? "")} `;
  const answerWords = normalizeAnswerForAudit(answer)
    .split(" ")
    .filter((word) => word.length >= 4);

  for (const answerWord of answerWords) {
    expect(normalizedHint).not.toContain(` ${answerWord} `);
  }
}

function sharedEmojiCount(first: string, second: string): number {
  const secondSet = normalizedEmojiSet(second);
  return [...normalizedEmojiSet(first)].filter((emoji) => secondSet.has(emoji)).length;
}

describe("partition A blind recheck 2 final calibration", () => {
  it("applies all eight approved A actions exactly once", () => {
    expect(finalCalibrationManifest).toHaveLength(8);
    expect(new Set(finalCalibrationManifest.map((card) => card.id)).size).toBe(8);

    for (const expected of finalCalibrationManifest) {
      expect(getPuzzle(expected.id)).toMatchObject(expected);
    }
  });

  it("keeps repaired explanations free of revision-history prose", () => {
    const revisionHistoryProse = /\b(?:old|previous|prior|original|earlier)\s+(?:clue|card|version|draft|wording|copy|text)\b/i;

    for (const expected of finalCalibrationManifest) {
      expect(expected.explanation).not.toMatch(revisionHistoryProse);
      expect(getPuzzle(expected.id).explanation).not.toMatch(revisionHistoryProse);
    }
  });

  it("preserves catalog counts, IDs, answers, and reveal metadata", () => {
    expect(expandedPuzzles).toHaveLength(1130);
    expect(puzzles).toHaveLength(1320);
    expect(new Set(expandedPuzzles.map((puzzle) => puzzle.id)).size).toBe(1130);

    for (const expected of finalCalibrationManifest) {
      const actual = getPuzzle(expected.id);
      expect(actual.categoryId).toBe(expected.categoryId);
      expect(actual.answer).toBe(expected.answer);
      expect(actual.details).toBe(expected.details);
      expect(actual.funFact).toBe(expected.funFact);
      expect(actual.tags).toEqual(expected.tags);
    }
  });

  it("keeps every calibrated clue and hint free of leaks and malformed spacing", () => {
    for (const expected of finalCalibrationManifest) {
      const puzzle = getPuzzle(expected.id);
      expect(puzzle.emojis, `${expected.id} clue whitespace`).not.toMatch(/\s/u);
      expect(graphemes(puzzle.emojis).length, `${expected.id} grapheme count`).toBeGreaterThanOrEqual(3);
      expect(graphemes(puzzle.emojis).length, `${expected.id} grapheme count`).toBeLessThanOrEqual(5);
      expect(findDirectAnswerEmojiLeaks([puzzle], answerEmojiBanlist)).toEqual([]);

      const normalizedHint = normalizeAnswerForAudit(puzzle.hint ?? "");
      expect(normalizedHint).not.toContain(normalizeAnswerForAudit(puzzle.answer));
      expectHintDoesNotNameAnswer(puzzle.hint, puzzle.answer);
    }
  });

  it("keeps calibrated clues free of category-context filler", () => {
    for (const expected of finalCalibrationManifest) {
      for (const bannedEmoji of categoryContextBans[expected.categoryId] ?? []) {
        expect(getPuzzle(expected.id).emojis, `${expected.id} context ${bannedEmoji}`).not.toContain(
          bannedEmoji,
        );
      }

    }
  });

  it("keeps each calibrated clue distinct from every same-category clue and neighbor", () => {
    for (const expected of finalCalibrationManifest) {
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

  it("keeps affected category repetition at or below the reviewed threshold", () => {
    const affectedCategoryIds = new Set(finalCalibrationManifest.map((card) => card.categoryId));
    const acceptedExistingWarnings: Record<string, readonly string[]> = {
      vegetables: ["🍃"],
      breakfast: ["🔥"],
    };

    for (const categoryId of affectedCategoryIds) {
      const usage = getCategoryEmojiUsage(
        puzzles.filter((puzzle) => puzzle.categoryId === categoryId),
      );
      expect(
        [...usage.entries()].filter(
          ([emoji, { ratio }]) =>
            ratio > 0.2 && !acceptedExistingWarnings[categoryId]?.includes(emoji),
        ),
        `${categoryId} repetition warnings`,
      ).toEqual([]);
    }
  });

  it("keeps the integrated A catalog invariant-clean and answer-safe", () => {
    expect(findDirectAnswerEmojiLeaks(puzzles, answerEmojiBanlist)).toEqual([]);
    expect(findContentInvariantViolations(categories, puzzles)).toEqual([]);

    for (const expected of finalCalibrationManifest) {
      const clueSet = normalizedEmojiSet(getPuzzle(expected.id).emojis);
      expect(clueSet.size).toBeGreaterThanOrEqual(3);
      expect(getPuzzle(expected.id).explanation?.trim()).toBeTruthy();
    }
  });
});

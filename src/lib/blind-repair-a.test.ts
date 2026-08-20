import { describe, expect, it } from "vitest";
import { answerEmojiBanlist } from "@/data/answerEmojiBanlist";
import { puzzles } from "@/data/puzzles";
import { findDirectAnswerEmojiLeaks, normalizeAnswerForAudit } from "@/lib/clue-audit";
import type { Puzzle, PuzzleDifficulty } from "@/types/puzzle";

const sourcePuzzles = puzzles;

type ExpectedCard = {
  id: string;
  categoryId: string;
  answer: string;
  difficulty: PuzzleDifficulty;
  emojis: string;
  hint: string;
  explanation: string;
};

const immediateRewrites: readonly ExpectedCard[] = [
  {
    id: "ariel",
    categoryId: "disney-princesses",
    answer: "Ariel",
    difficulty: "easy",
    emojis: "🌊🪸🪞🎶",
    hint: "An undersea princess collects human treasures and risks her voice to reach the surface.",
    explanation: "🌊 and 🪸 place the story below the surface, 🪞 represents the human objects she collects, and 🎶 points to the voice she risks.",
  },
  {
    id: "belle",
    categoryId: "disney-princesses",
    answer: "Belle",
    difficulty: "easy",
    emojis: "📚🌹🤝🕯️",
    hint: "A bookish village girl chooses compassion inside an enchanted castle.",
    explanation: "📚 shows her love of reading, 🌹 marks the enchanted rose, 🤝 represents the compassion she learns to choose, and 🕯️ evokes the enchanted household.",
  },
  {
    id: "jasmine",
    categoryId: "disney-princesses",
    answer: "Jasmine",
    difficulty: "medium",
    emojis: "🏜️🕌🪽🧭",
    hint: "A headstrong princess seeks freedom beyond a desert palace with a tiger companion.",
    explanation: "🏜️ places the story in the desert, 🕌 evokes the palace, 🪽 represents her wish for freedom beyond its walls, and 🧭 points to the journey she chooses.",
  },
  {
    id: "tiana",
    categoryId: "disney-princesses",
    answer: "Tiana",
    difficulty: "easy",
    emojis: "🍲🎺🌙🏙️",
    hint: "A determined New Orleans server works toward opening her own restaurant while a bayou spell changes her plans.",
    explanation: "🍲 represents her cooking, 🎺 evokes New Orleans jazz, 🌙 places the adventure in the bayou at night, and 🏙️ points to the restaurant dream in her city.",
  },
  {
    id: "rapunzel",
    categoryId: "disney-princesses",
    answer: "Rapunzel",
    difficulty: "easy",
    emojis: "📏🏮🗼🌄",
    hint: "A sheltered princess leaves her tower to chase a lantern festival and a life beyond the walls.",
    explanation: "📏 evokes the extraordinary length that defines her story, 🏮 points to the lantern festival, 🗼 is the tower she leaves, and 🌄 represents the wider world she longs to see.",
  },
  {
    id: "merida",
    categoryId: "disney-princesses",
    answer: "Merida",
    difficulty: "medium",
    emojis: "🏹🌄🧶🤝",
    hint: "A fiercely independent Highland princess challenges an old custom and fights to repair a family bond.",
    explanation: "🏹 shows her archery, 🌄 places her in the Highlands, 🧶 represents the family tapestry, and 🤝 marks the bond she works to repair.",
  },
  {
    id: "elsa",
    categoryId: "disney-princesses",
    answer: "Elsa",
    difficulty: "easy",
    emojis: "❄️🌀🧤🏰",
    hint: "A young queen learns to control a power that turns a palace into ice.",
    explanation: "❄️ shows the cold power she must control, 🌀 evokes its swirling magic, 🧤 recalls the restraint she tries to maintain, and 🏰 marks the palace transformed by it.",
  },
  {
    id: "anna",
    categoryId: "disney-princesses",
    answer: "Anna",
    difficulty: "easy",
    emojis: "❤️🧭🏔️🪢",
    hint: "A fearless younger sister crosses a frozen wilderness to bring her family home.",
    explanation: "❤️ represents her loyal love, 🧭 shows the journey she undertakes, 🏔️ places the crossing in a frozen mountain landscape, and 🪢 symbolizes the family bond she refuses to lose.",
  },
  {
    id: "animals-elephant",
    categoryId: "animals",
    answer: "Elephant",
    difficulty: "easy",
    emojis: "📏👂👐💧",
    hint: "A huge animal with a trunk and big ears.",
    explanation: "📏 emphasizes its enormous size, 👂 highlights its famously large ears, 👐 evokes the trunk used like a hand, and 💧 points to its need for water.",
  },
  {
    id: "animals-horse",
    categoryId: "animals",
    answer: "Horse",
    difficulty: "easy",
    emojis: "🪮🧑‍🌾🛞💨",
    hint: "A maned farm animal can gallop and pull or carry people.",
    explanation: "🪮 evokes grooming a mane, 🧑‍🌾 represents a rider or handler, 🛞 points to a horse-drawn cart, and 💨 signals a gallop.",
  },
  {
    id: "dinosaurs-carnotaurus",
    categoryId: "dinosaurs",
    answer: "Carnotaurus",
    difficulty: "medium",
    emojis: "🦬🌎🤏🧠",
    hint: "A horned South American predator had comically tiny arms and an unusually deep skull.",
    explanation: "🦬 evokes the paired brow horns without depicting the dinosaur, 🌎 identifies South America, 🤏 shows the tiny arms, and 🧠 points to the deep skull.",
  },
  {
    id: "vegetables-broccoli",
    categoryId: "vegetables",
    answer: "Broccoli",
    difficulty: "easy",
    emojis: "💚🌳🧩♨️",
    hint: "A green, tree-shaped vegetable is steamed in bite-sized florets.",
    explanation: "💚 shows the green crown, 🌳 evokes its branching tree-like shape, 🧩 represents the clustered florets, and ♨️ signals steaming.",
  },
  {
    id: "vegetables-zucchini",
    categoryId: "vegetables",
    answer: "Zucchini",
    difficulty: "easy",
    emojis: "🟩🔘🍝🌀",
    hint: "A smooth summer squash can be sliced into rounds or spiralized into noodles.",
    explanation: "🟩 shows the smooth green skin, 🔘 represents round slices, 🍝 points to its noodle-like cooked preparation, and 🌀 shows spiralizing.",
  },
  {
    id: "breakfast-scrambled-eggs",
    categoryId: "breakfast",
    answer: "Scrambled Eggs",
    difficulty: "easy",
    emojis: "🟡🌀🧩♨️",
    hint: "Eggs are stirred into soft curds in a warm pan.",
    explanation: "🟡 represents the yolk, 🌀 shows the stirring motion, 🧩 represents the soft curds, and ♨️ signals the heat.",
  },
  {
    id: "breakfast-breakfast-casserole",
    categoryId: "breakfast",
    answer: "Breakfast Casserole",
    difficulty: "easy",
    emojis: "🫕🧱🔥⏱️",
    hint: "Eggs and other morning ingredients bake in layers in one dish.",
    explanation: "🫕 represents the baking dish, 🧱 shows the assembled layers, 🔥 signals oven heat, and ⏱️ points to the make-ahead timing that suits a group dish.",
  },
  {
    id: "desserts-macaron",
    categoryId: "desserts",
    answer: "Macaron",
    difficulty: "medium",
    emojis: "🌈⭕🫧🪞",
    hint: "A French sandwich cookie has two smooth meringue shells and a creamy center.",
    explanation: "🌈 evokes the colorful shells, ⭕ shows their round form, 🫧 points to the airy meringue texture, and 🪞 evokes the smooth shell surface.",
  },
];

type FocusedReview = {
  id: string;
  categoryId: string;
  answer: string;
  difficulty: PuzzleDifficulty;
  candidate: Omit<ExpectedCard, "id" | "categoryId" | "answer" | "difficulty">;
  fallback: Omit<ExpectedCard, "id" | "categoryId" | "answer" | "difficulty">;
  priorAlias: string;
};

const focusedReviews: readonly FocusedReview[] = [
  {
    id: "snacks-fruit-snacks",
    categoryId: "snacks",
    answer: "Fruit Snacks",
    difficulty: "easy",
    candidate: {
      emojis: "🌈🎒🧃🧩",
      hint: "Colorful fruit-flavored chews come in a lunchbox-friendly pouch.",
      explanation: "🌈 evokes varied fruit flavors, 🎒 points to a lunchbox snack, 🧃 suggests fruit-drink packaging, and 🧩 shows the playful molded shapes.",
    },
    fallback: {
      emojis: "🌈🍎🎒📦",
      hint: "Small fruit-flavored chews are packed for a lunchbox snack.",
      explanation: "🌈 gives varied fruit colors, 🍎 gives the fruit flavor cue, 🎒 gives the lunchbox setting, and 📦 gives the packaged snack format.",
    },
    priorAlias: "Gummy candy",
  },
  {
    id: "dinosaurs-pteranodon",
    categoryId: "dinosaurs",
    answer: "Pteranodon",
    difficulty: "medium",
    candidate: {
      emojis: "🪽📐↩️🐟",
      hint: "A Late Cretaceous pterosaur has a long toothless jaw and a backward-pointing crest.",
      explanation: "🪽 shows flight, 📐 signals the long jaw, ↩️ marks the backward-pointing crest, and 🐟 suggests coastal prey.",
    },
    fallback: {
      emojis: "🪽📐↩️🌊",
      hint: "A flying Late Cretaceous reptile had a long toothless jaw and a backward crest above the coast.",
      explanation: "🪽 gives powered flight, 📐 gives the long jaw, ↩️ gives the backward crest, and 🌊 places this coastal pterosaur in its habitat.",
    },
    priorAlias: "Pterodactyl",
  },
];

const princessDirectCueGlyphs: Readonly<Record<string, readonly string[]>> = {
  Ariel: ["🧜‍♀️", "🦰", "🦀", "🔱", "🦵"],
  Belle: ["🫖", "👗"],
  Jasmine: ["🐅", "🪄", "🧞‍♂️", "💎"],
  Tiana: ["🐸", "👑"],
  Rapunzel: ["💇‍♀️", "🦎", "🌸"],
  Merida: ["🐻", "🧡"],
  Elsa: ["👑", "🎶", "🧊"],
  Anna: ["👩‍🦰", "👭", "⛄"],
};

function findPuzzle(id: string): Puzzle {
  const puzzle = sourcePuzzles.find((candidate) => candidate.id === id);
  if (!puzzle) {
    throw new Error(`Missing expected puzzle ${id}`);
  }
  return puzzle;
}

function graphemes(value: string): string[] {
  return [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(value)].map(
    ({ segment }) => segment,
  );
}

function normalizedEmoji(value: string): string {
  return value.replace(/\uFE0F/g, "");
}

function emojiSet(value: string): Set<string> {
  return new Set(graphemes(normalizedEmoji(value)));
}

function sharedEmojis(first: string, second: string): string[] {
  const secondSet = emojiSet(second);
  return [...emojiSet(first)].filter((emoji) => secondSet.has(emoji)).sort();
}

function expectClueShape(emojis: string): void {
  expect(emojis).not.toMatch(/[\s\n\r]/);
  expect(graphemes(emojis).length).toBeGreaterThanOrEqual(3);
  expect(graphemes(emojis).length).toBeLessThanOrEqual(5);
}

function expectNoAnswerOrAliasText(text: string | undefined, answer: string, alias?: string): void {
  const normalizedText = normalizeAnswerForAudit(text ?? "");
  expect(normalizedText).not.toContain(normalizeAnswerForAudit(answer));
  if (alias) {
    expect(normalizedText).not.toContain(normalizeAnswerForAudit(alias));
  }
}

describe("partition A blind-review follow-up repairs", () => {
  it("applies every immediate rewrite field to its exact source card", () => {
    for (const expected of immediateRewrites) {
      const puzzle = findPuzzle(expected.id);

      expect(puzzle.categoryId, `${expected.id} category`).toBe(expected.categoryId);
      expect(puzzle.answer, `${expected.id} answer`).toBe(expected.answer);
      expect(puzzle.difficulty, `${expected.id} difficulty`).toBe(expected.difficulty);
      expect(puzzle.emojis, `${expected.id} emojis`).toBe(expected.emojis);
      expect(puzzle.hint, `${expected.id} hint`).toBe(expected.hint);
      expect(puzzle.explanation, `${expected.id} explanation`).toBe(expected.explanation);
      expectClueShape(puzzle.emojis);
      expectNoAnswerOrAliasText(puzzle.hint, puzzle.answer);
      expect(findDirectAnswerEmojiLeaks([puzzle], answerEmojiBanlist)).toEqual([]);
    }
  });

  it("keeps focused-review candidates active while preserving their deterministic fallbacks", () => {
    for (const review of focusedReviews) {
      const puzzle = findPuzzle(review.id);

      expect(puzzle.categoryId, `${review.id} category`).toBe(review.categoryId);
      expect(puzzle.answer, `${review.id} answer`).toBe(review.answer);
      expect(puzzle.difficulty, `${review.id} difficulty`).toBe(review.difficulty);
      expect(puzzle.emojis, `${review.id} candidate emojis`).toBe(review.candidate.emojis);
      expect(puzzle.hint, `${review.id} candidate hint`).toBe(review.candidate.hint);
      expect(puzzle.explanation, `${review.id} candidate explanation`).toBe(review.candidate.explanation);
      expect(puzzle.emojis).not.toBe(review.fallback.emojis);
      expectClueShape(review.candidate.emojis);
      expectClueShape(review.fallback.emojis);
      expectNoAnswerOrAliasText(review.candidate.hint, review.answer, review.priorAlias);
      expectNoAnswerOrAliasText(review.fallback.hint, review.answer, review.priorAlias);

      const fallback: Puzzle = {
        ...puzzle,
        emojis: review.fallback.emojis,
        hint: review.fallback.hint,
        explanation: review.fallback.explanation,
      };
      expect(findDirectAnswerEmojiLeaks([puzzle, fallback], answerEmojiBanlist)).toEqual([]);
    }
  });

  it("keeps the eight princess clues pairwise distinct and free of their old direct cues", () => {
    const princesses = immediateRewrites.filter(
      ({ categoryId }) => categoryId === "disney-princesses",
    );

    for (const princess of princesses) {
      const puzzle = findPuzzle(princess.id);
      for (const forbiddenGlyph of princessDirectCueGlyphs[princess.answer] ?? []) {
        expect(normalizedEmoji(puzzle.emojis)).not.toContain(normalizedEmoji(forbiddenGlyph));
      }
      expectNoAnswerOrAliasText(puzzle.hint, princess.answer);
    }

    for (let firstIndex = 0; firstIndex < princesses.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < princesses.length; secondIndex += 1) {
        const first = findPuzzle(princesses[firstIndex].id);
        const second = findPuzzle(princesses[secondIndex].id);
        expect(
          sharedEmojis(first.emojis, second.emojis).length,
          `${first.answer}/${second.answer} shared clue glyphs`,
        ).toBeLessThan(2);
      }
    }
  });

  it("separates every named vegetable and breakfast collision at the grapheme level", () => {
    const pairChecks = [
      ["vegetables-broccoli", "vegetables-brussels-sprouts", ["🧩"]],
      ["vegetables-broccoli", "vegetables-cauliflower", ["🧩"]],
      ["vegetables-zucchini", "vegetables-green-beans", ["🟩"]],
      ["breakfast-scrambled-eggs", "breakfast-breakfast-casserole", []],
      ["elsa", "anna", []],
    ] as const;

    for (const [firstId, secondId, expectedShared] of pairChecks) {
      const first = findPuzzle(firstId);
      const second = findPuzzle(secondId);
      expect(sharedEmojis(first.emojis, second.emojis), `${first.answer}/${second.answer}`).toEqual(
        expectedShared,
      );
    }
  });

  it("matches every documented repetition disposition after the rewrites", () => {
    const countEmoji = (categoryId: string, emoji: string): number =>
      sourcePuzzles.filter(
        (puzzle) =>
          puzzle.categoryId === categoryId && emojiSet(puzzle.emojis).has(normalizedEmoji(emoji)),
      ).length;

    expect(countEmoji("animals", "🌾")).toBe(5);
    expect(countEmoji("vegetables", "🔪")).toBe(6);
    expect(countEmoji("vegetables", "🍃")).toBe(7);
    expect(countEmoji("desserts", "🥄")).toBe(5);
    expect(countEmoji("breakfast", "🔥")).toBe(7);
  });
});

import { describe, expect, it } from "vitest";
import { answerEmojiBanlist } from "@/data/answerEmojiBanlist";
import { categories } from "@/data/categories";
import { expandedPuzzles } from "@/data/expandedPacks";
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
    expect(answerEmojiBanlist.zebra).toContain("🦓");
    expect(answerEmojiBanlist["tyrannosaurus rex"]).toContain("🦖");
    expect(answerEmojiBanlist["sea lion"]).toContain("🦭");
    expect(answerEmojiBanlist["string cheese"]).toContain("🧀");
    expect(answerEmojiBanlist.monkey).toEqual(expect.arrayContaining(["🐒", "🙈"]));
    expect(answerEmojiBanlist.horse).toContain("🏇");
    expect(answerEmojiBanlist["breakfast burrito"]).toContain("🌯");
    expect(answerEmojiBanlist["chocolate chip cookie"]).toContain("🍫");
    expect(answerEmojiBanlist.cheesecake).toContain("🧀");
    expect(answerEmojiBanlist["apple pie"]).toContain("🥧");
    expect(answerEmojiBanlist["lemon tart"]).toContain("🥧");
    expect(answerEmojiBanlist["banana split"]).toContain("🍨");
    expect(answerEmojiBanlist.muffin).toContain("🧁");
  });

  it("catches direct depiction variants for repaired strict-category answers", () => {
    const variantPuzzles: Puzzle[] = [
      {
        id: "synthetic-monkey-variant",
        answer: "Monkey",
        emojis: "🙈🌴",
        categoryId: "animals",
        difficulty: "easy",
      },
      {
        id: "synthetic-horse-variant",
        answer: "Horse",
        emojis: "🏇🌾",
        categoryId: "animals",
        difficulty: "easy",
      },
      {
        id: "synthetic-burrito-variant",
        answer: "Breakfast Burrito",
        emojis: "🌯🥚",
        categoryId: "breakfast",
        difficulty: "easy",
      },
    ];

    expect(findDirectAnswerEmojiLeaks(variantPuzzles, answerEmojiBanlist)).toEqual([
      expect.objectContaining({ puzzleId: "synthetic-monkey-variant", forbiddenEmoji: "🙈" }),
      expect.objectContaining({ puzzleId: "synthetic-horse-variant", forbiddenEmoji: "🏇" }),
      expect.objectContaining({ puzzleId: "synthetic-burrito-variant", forbiddenEmoji: "🌯" }),
    ]);
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

  it("keeps expanded-pack clues free of direct-answer emoji leaks", () => {
    expect(findDirectAnswerEmojiLeaks(expandedPuzzles, answerEmojiBanlist)).toEqual([]);
  });

  it("carries an explicit explanation through every partition A expanded card", () => {
    const partitionACategoryIds = new Set([
      "animals",
      "ocean-animals",
      "dinosaurs",
      "birds",
      "bugs",
      "fruit",
      "vegetables",
      "desserts",
      "snacks",
      "breakfast",
    ]);
    expect(
      expandedPuzzles
        .filter((puzzle) => partitionACategoryIds.has(puzzle.categoryId))
        .every((puzzle) => puzzle.explanation?.trim()),
    ).toBe(true);
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

  it("keeps audited expanded category-context clues clean", () => {
    const categoryContextBans: Record<string, string[]> = {
      "ocean-animals": ["🌊"],
      dinosaurs: ["🦖", "🦕"],
      birds: ["🐦"],
      vegetables: ["🌱"],
    };

    for (const [categoryId, bannedEmojis] of Object.entries(categoryContextBans)) {
      for (const puzzle of expandedPuzzles.filter((item) => item.categoryId === categoryId)) {
        for (const bannedEmoji of bannedEmojis) {
          expect(puzzle.emojis, `${puzzle.id} should not repeat ${bannedEmoji}`).not.toContain(
            bannedEmoji,
          );
        }
      }
    }
  });

  it("keeps expanded context fillers out of strict clue pools", () => {
    const count = (categoryId: string, emoji: string) =>
      expandedPuzzles.filter(
        (puzzle) => puzzle.categoryId === categoryId && puzzle.emojis.includes(emoji),
      ).length;

    expect(count("animals", "🌿")).toBe(0);
    expect(count("ocean-animals", "🫧")).toBe(0);
    expect(count("ocean-animals", "🪨")).toBe(0);
    expect(count("dinosaurs", "🪨")).toBeLessThanOrEqual(2);
    expect(count("dinosaurs", "🦷")).toBeLessThanOrEqual(2);
    expect(count("dinosaurs", "🌿")).toBe(0);
    expect(count("fruit", "🌳")).toBe(0);
    expect(count("fruit", "🌿")).toBe(0);
    expect(count("vegetables", "🥗")).toBe(0);
    expect(count("vegetables", "🟢")).toBe(0);
    expect(count("vegetables", "🌿")).toBe(0);
    expect(count("desserts", "🌀")).toBeLessThanOrEqual(2);
    expect(count("snacks", "🧂")).toBeLessThanOrEqual(2);
    expect(count("snacks", "🥣")).toBe(0);
  });

  it("keeps expanded canonical repairs shipped", () => {
    const puzzleById = new Map(expandedPuzzles.map((puzzle) => [puzzle.id, puzzle]));

    expect(puzzleById.get("dinosaurs-tyrannosaurus-rex")?.answer).toBe(
      "Tyrannosaurus rex",
    );
    expect(puzzleById.get("snacks-string-cheese")?.answer).toBe("String Cheese");
    expect(puzzleById.get("animals-penguin")?.emojis).toContain("🧊");
    expect(puzzleById.get("animals-penguin")?.emojis).not.toContain("🐧");
    expect(puzzleById.get("animals-fox")?.emojis).toContain("👂");
    expect(puzzleById.get("animals-fox")?.emojis).not.toContain("🦊");
    expect(puzzleById.get("ocean-animals-crab")?.emojis).toContain("↔️");
    expect(puzzleById.get("ocean-animals-crab")?.emojis).not.toContain("🦀");
    expect(puzzleById.get("desserts-cupcake")?.emojis).toContain("🍰");
    expect(puzzleById.get("desserts-cupcake")?.emojis).not.toMatch(/🍥|🎉|🕯️/u);
    expect(puzzleById.get("birds-robin")?.emojis).toContain("🎵");
    expect(puzzleById.get("birds-robin")?.hint).toContain("orange-red");
    expect(puzzleById.get("breakfast-muffin")?.emojis).not.toMatch(/🧁|🫐/u);
    expect(puzzleById.get("breakfast-breakfast-burrito")?.emojis).not.toContain("🌯");
    expect(puzzleById.get("animals-monkey")?.emojis).not.toContain("🙈");
    expect(puzzleById.get("animals-horse")?.emojis).not.toContain("🏇");
    expect(puzzleById.get("fruit-grapes")?.emojis).not.toContain("🍷");

    const componentRepairs: Record<string, string[]> = {
      "desserts-chocolate-chip-cookie": ["🍫", "🍪"],
      "desserts-cheesecake": ["🍰", "🧀"],
      "desserts-apple-pie": ["🍎", "🍏", "🥧"],
      "desserts-s-mores": ["🍫", "🍪"],
      "desserts-lemon-tart": ["🍋", "🥧"],
      "desserts-banana-split": ["🍌", "🍨", "🍒"],
    };
    for (const [puzzleId, forbiddenEmojis] of Object.entries(componentRepairs)) {
      for (const forbiddenEmoji of forbiddenEmojis) {
        expect(puzzleById.get(puzzleId)?.emojis, `${puzzleId} should not use ${forbiddenEmoji}`).not.toContain(
          forbiddenEmoji,
        );
      }
    }
  });

  it("keeps canonical entertainment answers and blind-review repairs shipped", () => {
    const puzzleById = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]));

    expect(puzzleById.get("minecraft-movie")?.answer).toBe("A Minecraft Movie");
    expect(puzzleById.get("minecraft-movie")?.emojis).toContain("🌀");
    expect(puzzleById.get("minecraft-movie")?.hint).toContain("four misfits");
    expect(puzzleById.get("pokemon-first-movie")?.answer).toBe(
      "Pokémon: The First Movie",
    );
    expect(puzzleById.get("pokemon-i-choose-you")?.answer).toBe(
      "Pokémon the Movie: I Choose You!",
    );
    expect(puzzleById.get("pokemon-tv")?.answer).toBe("Pokémon");
    expect(puzzleById.get("paw-patrol")?.answer).toBe("PAW Patrol");

    const ariel = puzzleById.get("ariel");
    expect(ariel?.emojis).toContain("🦀");
    expect(ariel?.emojis).toContain("🦰");
    expect(ariel?.emojis).toContain("🔱");
    expect(ariel?.emojis).toContain("🦵");
    expect(ariel?.hint).toContain("voice");
    expect(ariel?.hint).toContain("human legs");
    expect(ariel?.difficulty).toBe("easy");

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

    const mulan = puzzleById.get("mulan-movie");
    expect(mulan?.emojis).not.toContain("🏯");
    expect(mulan?.explanation).not.toContain("imperial China");
    expect(mulan?.explanation).toContain("Chinese setting");

    const merida = puzzleById.get("merida");
    expect(merida?.emojis).not.toContain("🏴");
    expect(merida?.explanation).not.toContain("Scottish setting");
    expect(merida?.explanation).toContain("Highland landscape");
  });

  it("keeps audited core facts specific and non-generic", () => {
    const puzzleById = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]));
    expect(puzzleById.get("belle")?.funFact).toContain("Best Picture");
    expect(puzzleById.get("madagascar")?.funFact).toContain("penguins");
    expect(puzzleById.get("croods")?.funFact).toContain("Best Animated Feature");
    expect(puzzleById.get("minecraft-movie")?.funFact).toContain("2014");
    expect(puzzleById.get("pokemon-i-choose-you")?.funFact).toContain("20th anniversary");
    expect(puzzleById.get("peppa-pig")?.funFact).toContain("Muddy Puddles");
    expect(puzzleById.get("secret-life-of-pets")?.funFact).toContain(
      "original animated film",
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

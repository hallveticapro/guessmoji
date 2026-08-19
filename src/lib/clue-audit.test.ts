import { describe, expect, it } from "vitest";
import { answerEmojiBanlist } from "@/data/answerEmojiBanlist";
import { categories } from "@/data/categories";
import { expandedPuzzles } from "@/data/expandedPacks";
import {
  findDirectAnswerEmojiLeaks,
  normalizeAnswerForAudit,
} from "@/lib/clue-audit";
import { getCategoryEmojiUsage } from "@/lib/content-audit";
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
    expect(answerEmojiBanlist["banana split"]).toEqual(expect.arrayContaining(["🍌", "🍨", "🍒"]));
    expect(answerEmojiBanlist["banana split"]).toContain("↔️");
    expect(answerEmojiBanlist.chips).toContain("🥔");
    expect(answerEmojiBanlist["trail mix"]).toEqual(expect.arrayContaining(["🥜", "🍫", "🍇"]));
    expect(answerEmojiBanlist["granola bar"]).toEqual(expect.arrayContaining(["🌾", "🍯", "🥜"]));
    expect(answerEmojiBanlist["rice cakes"]).toContain("🍚");
    expect(answerEmojiBanlist["sunflower seeds"]).toContain("🥜");
    expect(answerEmojiBanlist["seaweed snacks"]).toContain("🌊");
    expect(answerEmojiBanlist["animal crackers"]).toEqual(expect.arrayContaining(["🐾", "🍪"]));
    expect(answerEmojiBanlist["sunflower seeds"]).toContain("🌞");
    expect(answerEmojiBanlist["string cheese"]).toEqual(expect.arrayContaining(["🧵", "🧶", "🧀"]));
    expect(answerEmojiBanlist.muffin).toContain("🧁");
    expect(answerEmojiBanlist.cupcake).toContain("🍰");
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

  it("keeps Partition B report regressions repaired", () => {
    const puzzleById = new Map(expandedPuzzles.map((puzzle) => [puzzle.id, puzzle]));

    expect(answerEmojiBanlist.tennis).toContain("🎾");
    expect(answerEmojiBanlist.volleyball).toContain("🏐");
    expect(answerEmojiBanlist["diamond sword"]).toEqual(
      expect.arrayContaining(["💎", "🗡️"]),
    );
    expect(answerEmojiBanlist.pickaxe).toContain("⛏️");
    expect(answerEmojiBanlist.volcano).toContain("🌋");
    expect(answerEmojiBanlist.electricity).toContain("⚡");
    expect(answerEmojiBanlist["eiffel tower"]).toContain("🗼");
    expect(answerEmojiBanlist["statue of liberty"]).toContain("🗽");
    expect(answerEmojiBanlist["liberty bell"]).toContain("🔔");
    expect(answerEmojiBanlist.island).toContain("🏝️");

    expect(puzzleById.get("sports-tennis")?.emojis).not.toContain("🏸");
    expect(puzzleById.get("sports-volleyball")?.emojis).not.toContain("🥅");
    expect(puzzleById.get("party-games-simon-says")?.emojis).not.toContain("🚦");
    expect(puzzleById.get("arcade-classics-mortal-kombat")).toBeUndefined();
    expect(puzzleById.get("arcade-classics-pinball")?.difficulty).toBe("medium");
    expect(puzzleById.get("space-astronaut")?.emojis).toContain("🪖");
    expect(puzzleById.get("weather-tornado")?.emojis).toContain("🌀");
    expect(puzzleById.get("weather-fog")?.emojis).toContain("☁️");
    expect(puzzleById.get("world-geography-peninsula")?.emojis).toContain("3️⃣");
    expect(puzzleById.get("world-geography-compass-rose")?.emojis).toContain("✳️");
    expect(puzzleById.get("vehicles-bicycle")?.emojis).toContain("⚙️");
    expect(puzzleById.get("vehicles-motorcycle")?.emojis).toContain("↪️");
    expect(puzzleById.get("construction-hard-hat")?.emojis).toContain("🧠");
    expect(puzzleById.get("construction-blueprint")?.details).toContain(
      "Construction plan",
    );
  });

  it("keeps the Partition B fix-round blind regressions distinct and leak-free", () => {
    const puzzleById = new Map(expandedPuzzles.map((puzzle) => [puzzle.id, puzzle]));
    const get = (id: string): Puzzle => {
      const puzzle = puzzleById.get(id);
      expect(puzzle, `${id} should exist`).toBeDefined();
      return puzzle as Puzzle;
    };

    const milkyWay = get("space-milky-way");
    const galaxy = get("space-galaxy");
    expect(milkyWay.emojis).toContain("🏠");
    expect(galaxy.emojis).toContain("🌫️");
    expect(galaxy.emojis).toContain("✨");
    expect(galaxy.emojis).not.toContain("🌠");
    expect((galaxy.hint ?? "").toLowerCase()).not.toContain(normalizeAnswerForAudit(galaxy.answer));
    expect(galaxy.hint).not.toMatch(/Milky Way/i);
    expect(["⭐", "🌀", "🔭", "🌌"].filter((emoji) =>
      milkyWay.emojis.includes(emoji) && galaxy.emojis.includes(emoji),
    )).toEqual([]);

    const geography = expandedPuzzles.filter((puzzle) => puzzle.categoryId === "world-geography");
    const geographyEmojiUsage = getCategoryEmojiUsage(geography);
    expect(geographyEmojiUsage.get("🗺️")?.count ?? 0).toBeLessThanOrEqual(4);
    expect(geographyEmojiUsage.get("🧭")?.count ?? 0).toBeLessThanOrEqual(4);

    const weather = expandedPuzzles.filter((puzzle) => puzzle.categoryId === "weather");
    const math = expandedPuzzles.filter((puzzle) => puzzle.categoryId === "math");
    expect(getCategoryEmojiUsage(weather).get("💨")?.count ?? 0).toBeLessThanOrEqual(3);
    expect(getCategoryEmojiUsage(math).get("🔢")?.count ?? 0).toBeLessThanOrEqual(2);

    expect(answerEmojiBanlist.moon).toContain("🌒");
    expect(answerEmojiBanlist.saturn).toContain("🪐");
    expect(answerEmojiBanlist["milky way"]).toContain("🥛");
    expect(answerEmojiBanlist["indian ocean"]).toContain("🇮🇳");
    expect(answerEmojiBanlist["compass rose"]).toContain("🧭");
    expect(answerEmojiBanlist.triangle).toContain("🔺");
    expect(answerEmojiBanlist.circle).toEqual(expect.arrayContaining(["⭕", "🟢"]));
    expect(answerEmojiBanlist.pi).toEqual(expect.arrayContaining(["π", "🥧"]));

    expect(get("space-moon").emojis).not.toContain("🌒");
    expect(get("space-saturn").emojis).not.toContain("🪐");
    expect(get("world-geography-indian-ocean").emojis).not.toContain("🇮🇳");
    expect(get("world-geography-compass-rose").emojis).not.toContain("🧭");
    expect(get("math-triangle").emojis).not.toContain("🔺");
    expect(get("math-circle").emojis).not.toContain("⭕");
    expect(get("math-circle").emojis).not.toContain("🟢");
    expect(get("math-pi").emojis).not.toContain("π");
    expect(get("math-pi").emojis).not.toContain("🥧");

    expect(get("outdoor-games-four-square").emojis).not.toContain("4️⃣");
    expect(get("outdoor-games-four-square").emojis).not.toContain("⬜");
    expect(get("party-games-rock-paper-scissors").emojis).not.toMatch(/[✊✋✌️]/u);
    expect(get("world-landmarks-great-wall-of-china").emojis).not.toContain("🧱");
    expect(get("world-landmarks-pyramids-of-giza").emojis).not.toContain("🔺");
    expect(get("us-landmarks-white-house").emojis).not.toContain("⚪");
    expect(get("us-landmarks-gateway-arch").emojis).not.toContain("🚪");
    expect(get("books-the-cat-in-the-hat").emojis).not.toContain("🐱");
    expect(get("books-the-cat-in-the-hat").emojis).not.toContain("🎩");
    expect(get("books-magic-tree-house").emojis).not.toContain("🌳");
    expect(get("books-magic-tree-house").emojis).not.toContain("🏠");

    expect(get("minecraft-diamond-sword").explanation).toContain("sword");
    expect(get("minecraft-diamond-sword").hint).toContain("blue blade");
    expect(get("minecraft-crafting-table").explanation).toContain("3×3");
    expect(get("books-dog-man").explanation).toContain("🦴");
    expect(get("world-geography-mediterranean-sea").explanation).toContain("🌊");
  });

  it("keeps Partition C clues free of direct and component emoji leaks", () => {
    const partitionCCategoryIds = new Set([
      "jobs",
      "music-instruments",
      "music-genres",
      "art-supplies",
      "school-supplies",
      "camping",
      "national-parks",
      "holidays",
      "halloween",
      "winter-holidays",
      "summer-fun",
      "beach-day",
      "amusement-park",
      "around-the-house",
      "kitchen-tools",
      "literal-phrases",
      "idioms",
      "emotions",
      "robots",
      "plants",
    ]);
    const partitionCPuzzles = expandedPuzzles.filter((puzzle) =>
      partitionCCategoryIds.has(puzzle.categoryId),
    );

    expect(findDirectAnswerEmojiLeaks(partitionCPuzzles, answerEmojiBanlist)).toEqual([]);
    expect(answerEmojiBanlist.doctor).toEqual(expect.arrayContaining(["👩‍⚕️", "👨‍⚕️", "🧑‍⚕️"]));
    expect(answerEmojiBanlist.firefighter).toEqual(expect.arrayContaining(["🚒", "🔥"]));
    expect(answerEmojiBanlist.chef).toContain("👨‍🍳");
    expect(answerEmojiBanlist.pilot).toContain("👩‍✈️");
    expect(answerEmojiBanlist["colored pencils"]).toContain("✏️");
    expect(answerEmojiBanlist.scissors).toContain("✂️");
    expect(answerEmojiBanlist.smores).toEqual(
      expect.arrayContaining(["🔥", "🍫", "☁️", "🍪"]),
    );
    expect(answerEmojiBanlist["water balloon"]).toEqual(expect.arrayContaining(["🎈", "💧"]));
    expect(answerEmojiBanlist["ice cream truck"]).toEqual(
      expect.arrayContaining(["🚚", "🍦"]),
    );
    expect(answerEmojiBanlist["road trip"]).toEqual(expect.arrayContaining(["🚗", "🗺️"]));
    expect(answerEmojiBanlist["beach umbrella"]).toContain("⛱️");
    expect(answerEmojiBanlist["roller coaster"]).toContain("🎢");
    expect(answerEmojiBanlist["bumper cars"]).toContain("🚗");
    expect(answerEmojiBanlist.mirror).toContain("🪞");
    expect(answerEmojiBanlist.fireplace).toContain("🔥");
    expect(answerEmojiBanlist["robot arm"]).toContain("🦾");
    expect(answerEmojiBanlist["vacuum robot"]).toContain("🤖");
    expect(answerEmojiBanlist.android).toContain("🤖");
    expect(answerEmojiBanlist["factory robot"]).toContain("🤖");
    expect(answerEmojiBanlist["oak tree"]).toContain("🌳");
    expect(answerEmojiBanlist.bamboo).toContain("🎍");
  });

  it("keeps Partition C category-context glyphs out of every clue", () => {
    const bannedByCategory: Record<string, string[]> = {
      "music-instruments": ["🎵", "🎶"],
      "art-supplies": ["🎨"],
      "school-supplies": ["📄"],
      camping: ["🌲", "🌙"],
      "national-parks": ["🌲", "🏜️", "⛰️"],
      holidays: ["📅", "🎆"],
      halloween: ["🌙"],
      "winter-holidays": ["❄️"],
      "summer-fun": ["☀️"],
      "beach-day": ["🏖️", "🌊", "☀️"],
      "amusement-park": ["🎟️"],
      "around-the-house": ["🏠"],
      robots: ["🤖"],
      plants: ["🌱", "🌿"],
    };

    for (const [categoryId, bannedEmojis] of Object.entries(bannedByCategory)) {
      const categoryPuzzles = expandedPuzzles.filter((puzzle) => puzzle.categoryId === categoryId);
      for (const puzzle of categoryPuzzles) {
        for (const bannedEmoji of bannedEmojis) {
          expect(puzzle.emojis, `${puzzle.id} should not use ${bannedEmoji}`).not.toContain(
            bannedEmoji,
          );
        }
      }
    }
  });

  it("keeps Partition C repairs distinct and fact-safe", () => {
    const puzzleById = new Map(expandedPuzzles.map((puzzle) => [puzzle.id, puzzle]));
    const get = (id: string): Puzzle => {
      const puzzle = puzzleById.get(id);
      expect(puzzle, `${id} should exist`).toBeDefined();
      return puzzle as Puzzle;
    };

    expect(get("jobs-doctor").emojis).not.toContain("👩‍⚕️");
    expect(get("jobs-firefighter").emojis).not.toContain("🚒");
    expect(get("jobs-chef").emojis).not.toContain("👨‍🍳");
    expect(get("jobs-pilot").emojis).not.toContain("👩‍✈️");
    expect(get("music-instruments-guitar").emojis).not.toMatch(/[🎵🎶]/u);
    expect(get("music-instruments-drums").emojis).not.toMatch(/[🎵🎶]/u);
    expect(get("music-instruments-trumpet").emojis).not.toMatch(/[🎵🎶]/u);
    expect(get("music-instruments-flute").emojis).not.toMatch(/[🎵🎶]/u);
    expect(get("art-supplies-colored-pencils").emojis).not.toContain("✏️");
    expect(get("art-supplies-scissors").emojis).not.toContain("✂️");
    expect(get("camping-s-mores").emojis).not.toMatch(/[🔥🍫☁️🍪]/u);
    expect(get("halloween-skeleton").emojis).not.toContain("💀");
    expect(get("halloween-candy-corn").emojis).not.toContain("🌽");
    expect(get("summer-fun-water-balloon").emojis).not.toMatch(/[🎈💧]/u);
    expect(get("summer-fun-ice-cream-truck").emojis).not.toMatch(/[🚚🍦]/u);
    expect(get("beach-day-sandcastle").emojis).not.toContain("🏰");
    expect(get("amusement-park-bumper-cars").emojis).not.toContain("🚗");
    expect(get("around-the-house-mirror").emojis).not.toContain("🪞");
    expect(get("robots-robot-arm").emojis).not.toContain("🦾");
    expect(get("plants-oak-tree").emojis).not.toContain("🌳");
    expect(get("plants-bamboo").emojis).not.toContain("🎍");

    expect(get("winter-holidays-menorah").details).toContain("hanukkiah");
    expect(get("winter-holidays-menorah").funFact).not.toMatch(/eight nights plus a helper/i);
    expect(get("robots-robot").details).toMatch(/physical machine/i);
    expect(get("robots-robot").funFact).not.toMatch(/software agents/i);
    expect(get("national-parks-great-smoky-mountains").funFact).not.toMatch(/most visited/i);
    expect(get("holidays-valentine-s-day").funFact).not.toMatch(/1800s/i);
    expect(get("halloween-ghost").funFact).not.toMatch(/simple white fabric/i);
    expect(get("halloween-haunted-house").funFact).not.toMatch(/became popular/i);
    expect(get("winter-holidays-gift-wrap").funFact).not.toMatch(/early 1900s/i);
    expect(get("summer-fun-lemonade-stand").funFact).not.toMatch(/first business idea/i);
    expect(get("summer-fun-picnic").funFact).not.toMatch(/became popular/i);
    expect(get("literal-phrases-starstruck").funFact).not.toMatch(/celebrity culture/i);
    expect(get("literal-phrases-time-flies").funFact).not.toMatch(/Latin expression/i);
    expect(get("plants-rose").funFact).not.toMatch(/thousands of years/i);
  });

  it("keeps source-review context and delta-blind direct leaks out of Partition B", () => {
    const puzzleById = new Map(expandedPuzzles.map((puzzle) => [puzzle.id, puzzle]));
    const get = (id: string): Puzzle => {
      const puzzle = puzzleById.get(id);
      expect(puzzle, `${id} should exist`).toBeDefined();
      return puzzle as Puzzle;
    };

    expect(get("arcade-classics-street-fighter").emojis).not.toContain("🕹️");
    expect(get("space-milky-way").emojis).not.toContain("🌌");
    expect(get("space-neptune").emojis).not.toContain("🌌");
    expect(get("math-addition").emojis).not.toContain("➕");
    expect(get("math-fraction").emojis).not.toContain("➗");
    expect(get("math-graph").emojis).not.toMatch(/[📊📈]/u);
    expect(get("us-landmarks-white-house").emojis).not.toContain("🇺🇸");
    expect(get("us-landmarks-gateway-arch").emojis).not.toContain("🇺🇸");
    expect(get("world-geography-equator").emojis).not.toContain("🌍");
    expect(get("science-atom").emojis).not.toContain("🔬");
    expect(get("weather-thunderstorm").emojis).not.toContain("☁️");
    expect(
      getCategoryEmojiUsage(expandedPuzzles.filter((puzzle) => puzzle.categoryId === "books"))
        .get("📚")?.count ?? 0,
    ).toBe(0);

    expect(getCategoryEmojiUsage(expandedPuzzles.filter((puzzle) => puzzle.categoryId === "math")).get("🧮")?.count ?? 0).toBeLessThanOrEqual(2);
    expect(getCategoryEmojiUsage(expandedPuzzles.filter((puzzle) => puzzle.categoryId === "world-geography")).get("🌊")?.count ?? 0).toBeLessThanOrEqual(4);
    expect(getCategoryEmojiUsage(expandedPuzzles.filter((puzzle) => puzzle.categoryId === "world-geography")).get("❄️")?.count ?? 0).toBeLessThanOrEqual(4);
    expect(getCategoryEmojiUsage(expandedPuzzles.filter((puzzle) => puzzle.categoryId === "us-landmarks")).get("🇺🇸")?.count ?? 0).toBeLessThanOrEqual(2);
    expect(getCategoryEmojiUsage(expandedPuzzles.filter((puzzle) => puzzle.categoryId === "construction")).get("🧱")?.count ?? 0).toBeLessThanOrEqual(2);

    expect(answerEmojiBanlist.addition).toContain("➕");
    expect(answerEmojiBanlist.graph).toEqual(expect.arrayContaining(["📊", "📈"]));
    expect(answerEmojiBanlist.equator).toEqual(
      expect.arrayContaining(["🌍", "🌎", "🌏"]),
    );
    expect(answerEmojiBanlist["the cat in the hat"]).toEqual(expect.arrayContaining(["🐱", "🎩"]));
    expect(answerEmojiBanlist["the three little pigs"]).toContain("🐷");

    const normalizedCompoundLeaks: Puzzle[] = [
      {
        id: "synthetic-cat-in-hat-leak",
        answer: "The Cat in the Hat",
        emojis: "🐱🎩",
        categoryId: "books",
        difficulty: "easy",
      },
      {
        id: "synthetic-three-pigs-leak",
        answer: "The Three Little Pigs",
        emojis: "🐷🌾",
        categoryId: "fairy-tales",
        difficulty: "easy",
      },
    ];
    expect(findDirectAnswerEmojiLeaks(normalizedCompoundLeaks, answerEmojiBanlist)).toEqual([
      expect.objectContaining({ puzzleId: "synthetic-cat-in-hat-leak", forbiddenEmoji: "🐱" }),
      expect.objectContaining({ puzzleId: "synthetic-cat-in-hat-leak", forbiddenEmoji: "🎩" }),
      expect.objectContaining({ puzzleId: "synthetic-three-pigs-leak", forbiddenEmoji: "🐷" }),
    ]);
  });

  it("keeps round-three context and operator regressions out of Partition B", () => {
    const puzzleById = new Map(expandedPuzzles.map((puzzle) => [puzzle.id, puzzle]));
    const get = (id: string): Puzzle => {
      const puzzle = puzzleById.get(id);
      expect(puzzle, `${id} should exist`).toBeDefined();
      return puzzle as Puzzle;
    };

    expect(get("science-cell").emojis).not.toContain("🔬");
    expect(get("science-chemical-reaction").emojis).not.toContain("🧪");
    expect(get("math-division").emojis).not.toContain("➗");
    expect(get("math-subtraction").emojis).not.toContain("➖");
    expect(get("math-multiplication").emojis).not.toContain("✖️");
    expect(get("math-graph").emojis).not.toMatch(/[📊📈]/u);
    expect(get("world-landmarks-eiffel-tower").emojis).not.toContain("📸");
    expect(get("minecraft-diamond-sword").difficulty).toBe("medium");
    expect(get("books-the-cat-in-the-hat").emojis).toContain("🌧️");
    expect(get("world-geography-greenland").hint).not.toMatch(/Greenland/i);

    const geographyIds = [
      "world-geography-island",
      "world-geography-peninsula",
      "world-geography-equator",
      "world-geography-compass-rose",
      "world-geography-indian-ocean",
      "world-geography-greenland",
    ];
    for (const id of geographyIds) {
      expect(get(id).emojis, `${id} should not use generic map pins`).not.toContain("📍");
    }

    const geography = expandedPuzzles.filter((puzzle) => puzzle.categoryId === "world-geography");
    expect(getCategoryEmojiUsage(geography).get("📍")?.count ?? 0).toBeLessThanOrEqual(4);

    expect(answerEmojiBanlist.division).toContain("➗");
    expect(answerEmojiBanlist.subtraction).toContain("➖");
    expect(answerEmojiBanlist.multiplication).toContain("✖️");

    const operatorLeaks: Puzzle[] = [
      { id: "synthetic-division-leak", answer: "Division", emojis: "➗🍕", categoryId: "math", difficulty: "easy" },
      { id: "synthetic-subtraction-leak", answer: "Subtraction", emojis: "➖🍎", categoryId: "math", difficulty: "easy" },
      { id: "synthetic-multiplication-leak", answer: "Multiplication", emojis: "✖️📦", categoryId: "math", difficulty: "easy" },
    ];
    expect(findDirectAnswerEmojiLeaks(operatorLeaks, answerEmojiBanlist)).toEqual([
      expect.objectContaining({ puzzleId: "synthetic-division-leak", forbiddenEmoji: "➗" }),
      expect.objectContaining({ puzzleId: "synthetic-subtraction-leak", forbiddenEmoji: "➖" }),
      expect.objectContaining({ puzzleId: "synthetic-multiplication-leak", forbiddenEmoji: "✖️" }),
    ]);
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

  it("keeps round-two repaired clues distinctive", () => {
    const byId = new Map(expandedPuzzles.map((puzzle) => [puzzle.id, puzzle]));
    expect(byId.get("birds-eagle")?.emojis).not.toContain("🇺🇸");
    expect(byId.get("birds-eagle")?.hint).toMatch(/talon|soaring|prey/i);
    expect(byId.get("dinosaurs-pteranodon")?.hint).toMatch(/crest|jaw/i);
    expect(byId.get("animals-chicken")?.hint).toMatch(/comb|cluck/i);
    expect(byId.get("animals-crocodile")?.hint).toMatch(/V-shaped|lower teeth/i);
    expect(byId.get("fruit-orange")?.hint).toMatch(/peel|segment/i);
    expect(byId.get("snacks-crackers")?.hint).toMatch(/baked squares|cheese/i);
    expect(byId.get("fruit-apple")?.emojis).toContain("✏️");
    expect(byId.get("fruit-cherry")?.emojis).toContain("🪢");
  });

  it("keeps round-two generic filler at or below the review threshold", () => {
    const count = (categoryId: string, emoji: string) =>
      expandedPuzzles.filter(
        (puzzle) => puzzle.categoryId === categoryId && puzzle.emojis.includes(emoji),
      ).length;
    expect(count("snacks", "📦")).toBeLessThanOrEqual(4);
    expect(count("vegetables", "🪴")).toBeLessThanOrEqual(4);
    expect(count("vegetables", "📏")).toBeLessThanOrEqual(4);
    expect(count("breakfast", "🟫")).toBeLessThanOrEqual(4);
    expect(count("desserts", "🍬")).toBeLessThanOrEqual(4);
    expect(count("ocean-animals", "🏖️")).toBeLessThanOrEqual(4);
    expect(count("dinosaurs", "📏")).toBeLessThanOrEqual(2);
    expect(count("dinosaurs", "🛡️")).toBeLessThanOrEqual(2);
    expect(count("desserts", "✨")).toBeLessThanOrEqual(4);
    expect(count("desserts", "🫙")).toBeLessThanOrEqual(4);
    expect(count("dinosaurs", "🧱")).toBeLessThanOrEqual(2);
    expect(count("snacks", "🧺")).toBeLessThanOrEqual(4);
  });

  it("keeps expanded canonical repairs shipped", () => {
    const puzzleById = new Map(expandedPuzzles.map((puzzle) => [puzzle.id, puzzle]));

    expect(puzzleById.get("dinosaurs-tyrannosaurus-rex")?.answer).toBe(
      "Tyrannosaurus rex",
    );
    expect(puzzleById.get("snacks-hummus")?.answer).toBe("Hummus");
    expect(puzzleById.get("snacks-jerky")?.answer).toBe("Jerky");
    expect(puzzleById.get("snacks-jerky")?.difficulty).toBe("medium");
    expect(puzzleById.get("animals-penguin")?.emojis).toContain("🧊");
    expect(puzzleById.get("animals-penguin")?.emojis).not.toContain("🐧");
    expect(puzzleById.get("animals-fox")?.emojis).toContain("👂");
    expect(puzzleById.get("animals-fox")?.emojis).not.toContain("🦊");
    expect(puzzleById.get("ocean-animals-crab")?.emojis).toContain("↔️");
    expect(puzzleById.get("ocean-animals-crab")?.emojis).not.toContain("🦀");
    expect(puzzleById.get("desserts-cupcake")?.emojis).not.toMatch(/🍰|🧁|🍥|🎉|🕯️/u);
    expect(puzzleById.get("vegetables-bell-pepper")?.emojis).not.toContain("🔔");
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
      "desserts-s-mores": ["🍫", "🍪", "☁️", "🟫"],
      "snacks-chips": ["🥔"],
      "snacks-trail-mix": ["🥜", "🍫", "🍇"],
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

import { describe, expect, it } from "vitest";
import { answerEmojiBanlist } from "@/data/answerEmojiBanlist";
import { categories } from "@/data/categories";
import { expandedPuzzles } from "@/data/expandedPacks";
import { puzzles } from "@/data/puzzles";
import { findDirectAnswerEmojiLeaks, normalizeAnswerForAudit } from "@/lib/clue-audit";
import { getCategoryEmojiUsage, findContentInvariantViolations } from "@/lib/content-audit";
import { getRandomMixPuzzlePool } from "@/lib/puzzles";
import type { Puzzle } from "@/types/puzzle";

const repairManifest = [
  {
    id: "minecraft-pickaxe",
    categoryId: "minecraft",
    answer: "Pickaxe",
    difficulty: "medium",
    emojis: "🕳️🪨🪵💥",
    hint: "A handheld tool breaks stone and ore with a pointed striking head.",
    explanation: "🕳️ opens the mine; 🪨 is the broken material; 🪵 is the handle; 💥 shows the striking work.",
  },
  {
    id: "minecraft-diamond-sword",
    categoryId: "minecraft",
    answer: "Diamond Sword",
    difficulty: "medium",
    emojis: "🟦👊💥🧱",
    hint: "A high-tier Minecraft melee item deals damage at close range.",
    explanation: "🟦 marks the blue high-tier material; 👊 shows close combat; 💥 is the hit; 🧱 is the block target.",
  },
  {
    id: "books-matilda",
    categoryId: "books",
    answer: "Matilda",
    difficulty: "easy",
    emojis: "👧🧠🪑⬆️🏫",
    hint: "A gifted child turns an unfair school upside down with her mind.",
    explanation: "👧 is the gifted child; 🧠 signals unusual mental power; 🪑⬆️ shows furniture lifted by thought; 🏫 is the school.",
  },
  {
    id: "math-circle",
    categoryId: "math",
    answer: "Circle",
    difficulty: "easy",
    emojis: "🎯📏🧭🧵",
    hint: "A drawing tool can trace it from one fixed center at one distance.",
    explanation: "🎯 marks the center; 📏 measures the radius; 🧭 traces the fixed distance; 🧵 follows the closed boundary.",
  },
  {
    id: "math-rectangle",
    categoryId: "math",
    answer: "Rectangle",
    difficulty: "easy",
    emojis: "🪟📏📐↔️",
    hint: "A four-sided shape keeps opposite lengths alike while its long and short spans can differ.",
    explanation: "🪟 gives a rectangular frame; 📏 measures its spans; 📐 marks right corners; ↔️ emphasizes the longer horizontal direction.",
  },
  {
    id: "math-square",
    categoryId: "math",
    answer: "Square",
    difficulty: "easy",
    emojis: "🏁🧩🪞🔄",
    hint: "A four-sided tile has equal spans, right corners, and quarter-turn symmetry.",
    explanation: "🏁 gives a checkered equal-cell pattern; 🧩 is the tile-like form; 🪞 shows matching halves; 🔄 gives quarter-turn symmetry.",
  },
  {
    id: "sports-track-and-field",
    categoryId: "sports",
    answer: "Track and Field",
    difficulty: "medium",
    emojis: "🏃‍♂️🏁↗️🥏📏",
    hint: "A meet combines lane races with jumping and throwing events, all measured or timed.",
    explanation: "🏃‍♂️ gives the lane races; 🏁 marks the timed meet; ↗️ shows a jump; 🥏 evokes a discus throw; 📏 records measured marks.",
  },
  {
    id: "sports-skateboarding",
    categoryId: "sports",
    answer: "Skateboarding",
    difficulty: "medium",
    emojis: "🛝🪖↗️🧱",
    hint: "An action sport sends a rider over ramps and ledges on a small wheeled platform.",
    explanation: "🛝 is the ramp; 🪖 is protective gear; ↗️ shows an airborne trick; 🧱 is an urban ledge or park feature.",
  },
  {
    id: "sports-snowboarding",
    categoryId: "sports",
    answer: "Snowboarding",
    difficulty: "medium",
    emojis: "🏔️🪖↔️🌀🧊",
    hint: "A winter action sport uses sideways carving, jumps, and rails on a single runner.",
    explanation: "🏔️ is the slope; 🪖 is safety gear; ↔️ shows sideways carving; 🌀 is a trick; 🧊 marks the icy course.",
  },
  {
    id: "party-games-simon-says",
    categoryId: "party-games",
    answer: "Simon Says",
    difficulty: "medium",
    emojis: "📣👂🛑👣🫡",
    hint: "Players move only when a leader begins an instruction with a special two-word cue.",
    explanation: "📣 is the leader; 👂 means listen; 🛑 marks waiting for the cue; 👣 are the movements; 🫡 shows following a valid instruction.",
  },
  {
    id: "arcade-classics-track-and-field",
    categoryId: "arcade-classics",
    answer: "Track & Field",
    difficulty: "medium",
    emojis: "🕹️🔘🔘🏃‍♂️🥏",
    hint: "A classic arcade sports title rewards rapid button presses across races, jumps, and throws.",
    explanation: "🕹️ is the arcade cabinet; 🔘🔘 show rapid button mashing; 🏃‍♂️ is a race; 🥏 evokes a measured throwing event.",
  },
  {
    id: "science-electricity",
    categoryId: "science",
    answer: "Electricity",
    difficulty: "medium",
    emojis: "🔋🔌💡📡",
    hint: "Charge moving through a system powers light, communication, and devices.",
    explanation: "🔋 supplies charge; 🔌 gives the connection; 💡 shows light; 📡 shows powered communication.",
  },
  {
    id: "weather-blizzard",
    categoryId: "weather",
    answer: "Blizzard",
    difficulty: "medium",
    emojis: "🌬️🌨️🚧🌫️",
    hint: "A winter storm brings sustained wind, blowing snow, and dangerously low visibility.",
    explanation: "🌬️ is sustained wind; 🌨️ is blowing snow; 🚧 shows travel being blocked; 🌫️ shows the lost visibility.",
  },
  {
    id: "books-the-cat-in-the-hat",
    categoryId: "books",
    answer: "The Cat in the Hat",
    difficulty: "medium",
    emojis: "🟥⬜1️⃣2️⃣🚪",
    hint: "A playful intruder brings two numbered companions into a quiet home.",
    explanation: "🟥⬜ create the visitor's striped palette; 1️⃣2️⃣ are the two numbered companions; 🚪 is the unexpected doorway arrival.",
  },
  {
    id: "world-landmarks-great-wall-of-china",
    categoryId: "world-landmarks",
    answer: "Great Wall of China",
    difficulty: "medium",
    emojis: "↪️🏯🛡️👀📏",
    hint: "A centuries-old frontier defense winds for miles across northern terrain.",
    explanation: "↪️ shows the winding route; 🏯 gives watchtowers; 🛡️ is defense; 👀 is the lookout; 📏 emphasizes the long span.",
  },
  {
    id: "us-landmarks-white-house",
    categoryId: "us-landmarks",
    answer: "White House",
    difficulty: "medium",
    emojis: "🏛️🧑‍💼🪑🌳📣",
    hint: "The U.S. president both lives and works in this famous executive building.",
    explanation: "🏛️ is the official building; 🧑‍💼 is the executive workplace; 🪑 suggests the office; 🌳 is the lawn; 📣 evokes public addresses.",
  },
  {
    id: "us-landmarks-gateway-arch",
    categoryId: "us-landmarks",
    answer: "Gateway Arch",
    difficulty: "medium",
    emojis: "🌊🏙️🚋⬆️↔️",
    hint: "A shiny landmark beside a major waterway carries visitors upward in a Midwestern city.",
    explanation: "🌊 places the landmark beside the Mississippi; 🏙️ gives the city setting; 🚋 is the tram inside; ⬆️↔️ show the rising span.",
  },
  {
    id: "us-landmarks-washington-monument",
    categoryId: "us-landmarks",
    answer: "Washington Monument",
    difficulty: "easy",
    emojis: "🪨📏🔺🇺🇸🌳",
    hint: "A pointed stone landmark rises from the National Mall in the nation's capital.",
    explanation: "🪨 is the stone; 📏 emphasizes the tall scale; 🔺 gives the pointed obelisk profile; 🇺🇸 supplies the national setting; 🌳 evokes the National Mall grounds.",
  },
  {
    id: "world-geography-africa",
    categoryId: "world-geography",
    answer: "Africa",
    difficulty: "medium",
    emojis: "🧭↕️🏜️🌴🌋",
    hint: "A continent spans Mediterranean shores, equatorial forests, and southern grasslands.",
    explanation: "🧭↕️ show the broad north-to-south span; 🏜️ gives desert landscapes; 🌴 gives tropical regions; 🌋 adds varied landforms.",
  },
  {
    id: "world-geography-arctic-ocean",
    categoryId: "world-geography",
    answer: "Arctic Ocean",
    difficulty: "medium",
    emojis: "🧊⬆️🚢🌬️",
    hint: "The poleward sea is Earth's smallest, mostly ice-covered basin.",
    explanation: "🧊 is sea ice; ⬆️ marks the poleward position; 🚢 gives the waterway; 🌬️ supplies the polar wind.",
  },
  {
    id: "world-geography-himalayas",
    categoryId: "world-geography",
    answer: "Himalayas",
    difficulty: "medium",
    emojis: "🇳🇵📏❄️🧗‍♀️",
    hint: "A range along the Indian–Eurasian collision includes the planet's highest summit.",
    explanation: "🇳🇵 places the range by Nepal; 📏 emphasizes extreme height; ❄️ shows snow; 🧗‍♀️ shows high-altitude climbing.",
  },
  {
    id: "myths-loki",
    categoryId: "myths",
    answer: "Loki",
    difficulty: "medium",
    emojis: "🦊🌀⛓️🐍",
    hint: "A Norse shapeshifter repeatedly upsets the gods and slips between forms.",
    explanation: "🦊 gives the trickster; 🌀 shows changing forms; ⛓️ recalls the binding punishment; 🐍 connects to Loki's serpent-linked mythology.",
  },
  {
    id: "world-landmarks-golden-temple",
    categoryId: "world-landmarks",
    answer: "Golden Temple",
    difficulty: "medium",
    emojis: "✨🟡💧🙏",
    hint: "A Sikh gurdwara welcomes visitors around a gold-covered shrine set in a sacred pool.",
    explanation: "✨ and 🟡 show the gold-covered shrine; 💧 is the sacred pool; 🙏 represents worship and the welcoming religious community.",
  },
  {
    id: "world-landmarks-victoria-memorial",
    categoryId: "world-landmarks",
    answer: "Victoria Memorial",
    difficulty: "medium",
    emojis: "🏛️👑🤍🌳🇮🇳",
    hint: "In Kolkata, a white-marble museum honors a British queen amid formal gardens.",
    explanation: "🏛️ is the memorial building; 👑 honors the British queen; 🤍 gives the white marble; 🌳 is the formal garden; 🇮🇳 locates India.",
  },
  {
    id: "world-geography-nile-river",
    categoryId: "world-geography",
    answer: "Nile River",
    difficulty: "easy",
    emojis: "🗺️🌊🌱🏺↕️",
    hint: "A long African waterway flows north through Egypt to the Mediterranean.",
    explanation: "🗺️ gives the mapped route; 🌊 is the waterway; 🌱 is the fertile edge; 🏺 places it in Egypt; ↕️ makes the northward flow meaningful.",
  },
  {
    id: "world-geography-indian-ocean",
    categoryId: "world-geography",
    answer: "Indian Ocean",
    difficulty: "medium",
    emojis: "🌊🧭🌴⬇️",
    hint: "A warm sea lies between eastern Africa, southern Asia, and Australia.",
    explanation: "🌊 is the ocean; 🧭 gives its position between continents; 🌴 evokes tropical shores; ⬇️ marks the southern route.",
  },
  {
    id: "world-geography-south-america",
    categoryId: "world-geography",
    answer: "South America",
    difficulty: "medium",
    emojis: "🗺️🏔️🌿🌋⬇️",
    hint: "A continent stretches from the Caribbean edge toward Cape Horn, crossing the Andes and Amazon Basin.",
    explanation: "🗺️ gives continental scale; 🏔️ is the Andes; 🌿 is the Amazon; 🌋 and ⬇️ span its landforms from north to south.",
  },
  {
    id: "world-geography-danube-river",
    categoryId: "world-geography",
    answer: "Danube River",
    difficulty: "medium",
    emojis: "🛶🇦🇹🇸🇰🇭🇺🇷🇸",
    hint: "A navigable European waterway passes four capital cities before the Black Sea.",
    explanation: "🛶 gives a navigable inland waterway; 🇦🇹, 🇸🇰, 🇭🇺, and 🇷🇸 are the four countries whose capitals lie along its route.",
  },
] as const;

const pairwiseSets = [
  ["math-circle", "math-rectangle", "math-square", "math-triangle", "math-graph", "math-symmetry"],
  ["books-the-cat-in-the-hat", "books-matilda", "books-harry-potter", "books-green-eggs-and-ham", "books-the-bfg", "books-the-lorax"],
  ["sports-track-and-field", "sports-skateboarding", "sports-skiing", "sports-snowboarding", "sports-bowling", "sports-surfing"],
  ["world-geography-africa", "world-geography-asia", "world-geography-europe", "world-geography-south-america", "world-geography-arctic-ocean", "world-geography-himalayas", "world-geography-alps", "world-geography-mount-everest"],
  ["us-landmarks-white-house", "us-landmarks-gateway-arch", "us-landmarks-washington-monument", "us-landmarks-lincoln-memorial", "us-landmarks-independence-hall", "us-landmarks-mount-vernon"],
  ["arcade-classics-track-and-field", "arcade-classics-out-run", "arcade-classics-paperboy", "arcade-classics-pinball", "arcade-classics-missile-command"],
] as const;

const repairCategoryIds: Set<string> = new Set(repairManifest.map((card) => card.categoryId));

function graphemes(value: string): string[] {
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  return [...segmenter.segment(value)].map(({ segment }) => segment);
}

function getPuzzle(id: string): Puzzle {
  const puzzle = expandedPuzzles.find((candidate) => candidate.id === id);
  expect(puzzle, `${id} should exist`).toBeDefined();
  return puzzle as Puzzle;
}

describe("partition B blind-review follow-up repairs", () => {
  it("matches every approved repair row exactly and keeps the manifest unique", () => {
    expect(repairManifest).toHaveLength(28);
    expect(new Set(repairManifest.map((card) => card.id)).size).toBe(28);

    for (const expected of repairManifest) {
      expect(getPuzzle(expected.id)).toMatchObject(expected);
    }
  });

  it("preserves the source pool shape and the immutable row identity fields", () => {
    expect(expandedPuzzles).toHaveLength(1130);

    for (const expected of repairManifest) {
      const actual = getPuzzle(expected.id);
      expect(actual.id).toBe(expected.id);
      expect(actual.categoryId).toBe(expected.categoryId);
      expect(actual.answer).toBe(expected.answer);
      expect(actual.details).toBeTruthy();
      expect(actual.funFact).toBeTruthy();
      expect(actual.tags?.length).toBeGreaterThan(0);
    }
  });

  it("records every durable component ban and leaves no direct leak", () => {
    expect(answerEmojiBanlist.pickaxe).toEqual(expect.arrayContaining(["⛏️", "⚒️"]));
    expect(answerEmojiBanlist["diamond sword"]).toEqual(
      expect.arrayContaining(["💎", "🗡️", "⚔️", "🤺"]),
    );
    expect(findDirectAnswerEmojiLeaks(puzzles, answerEmojiBanlist)).toEqual([]);
  });

  it("removes category-icon filler from the repaired category pools", () => {
    const contextBans: Record<string, string> = {
      books: "📚",
      "world-geography": "🌍",
      "world-landmarks": "🗺️",
    };

    for (const [categoryId, bannedEmoji] of Object.entries(contextBans)) {
      const usage = getCategoryEmojiUsage(
        expandedPuzzles.filter((puzzle) => puzzle.categoryId === categoryId),
      );
      expect(usage.get(bannedEmoji)?.count ?? 0, `${categoryId} context`).toBe(0);
    }
  });

  it("keeps hints free of full-answer and flagged component terms", () => {
    const forbiddenById: Record<string, readonly string[]> = {
      "sports-track-and-field": ["track", "field"],
      "world-landmarks-great-wall-of-china": ["china"],
      "world-landmarks-victoria-memorial": ["memorial"],
      "us-landmarks-white-house": ["washington"],
      "us-landmarks-washington-monument": ["washington", "monument"],
      "world-geography-nile-river": ["river"],
      "world-geography-indian-ocean": ["ocean"],
      "world-geography-south-america": ["south", "america"],
      "world-geography-danube-river": ["river"],
    };

    for (const expected of repairManifest) {
      const normalizedAnswer = normalizeAnswerForAudit(expected.answer);
      const normalizedHint = normalizeAnswerForAudit(getPuzzle(expected.id).hint ?? "");
      expect(normalizedHint).not.toContain(normalizedAnswer);
    }

    for (const [id, forbiddenTerms] of Object.entries(forbiddenById)) {
      const hint = getPuzzle(id).hint ?? "";
      for (const term of forbiddenTerms) {
        expect(hint, `${id} hint`).not.toMatch(new RegExp(`\\b${term}\\b`, "iu"));
      }
    }
  });

  it("explains every displayed emoji without audit or fallback prose", () => {
    for (const expected of repairManifest) {
      const puzzle = getPuzzle(expected.id);
      expect(puzzle.explanation).toBeTruthy();
      for (const emoji of graphemes(puzzle.emojis)) {
        expect(puzzle.explanation, `${expected.id} explanation for ${emoji}`).toContain(emoji);
      }
      expect(puzzle.explanation).not.toMatch(/audit|implementation|withheld|generic fallback/i);
    }
  });

  it("keeps every focused pairwise set distinct and free of duplicate normalized answers", () => {
    for (const ids of pairwiseSets) {
      const cards = ids.map((id) => getPuzzle(id));
      expect(new Set(cards.map((card) => card.emojis)).size).toBe(cards.length);
      expect(new Set(cards.map((card) => normalizeAnswerForAudit(card.answer))).size).toBe(cards.length);

      for (let leftIndex = 0; leftIndex < cards.length; leftIndex += 1) {
        const left = new Set(graphemes(cards[leftIndex].emojis));
        for (let rightIndex = leftIndex + 1; rightIndex < cards.length; rightIndex += 1) {
          const right = new Set(graphemes(cards[rightIndex].emojis));
          const shared = [...left].filter((emoji) => right.has(emoji));
          expect(shared.length, `${cards[leftIndex].id} vs ${cards[rightIndex].id}`).toBeLessThanOrEqual(2);
        }
      }
    }
  });

  it("leaves deterministic content invariants clean in every repaired category", () => {
    const findings = findContentInvariantViolations(categories, puzzles).filter(
      (finding) => finding.categoryId && repairCategoryIds.has(finding.categoryId),
    );
    expect(findings).toEqual([]);

    const randomMixPool = getRandomMixPuzzlePool();
    expect(new Set(randomMixPool.map((puzzle) => normalizeAnswerForAudit(puzzle.answer))).size).toBe(
      randomMixPool.length,
    );
  });

  it("keeps repaired category emoji usage at or below the review threshold", () => {
    const warnings: Array<{ categoryId: string; emoji: string; count: number; ratio: number }> = [];
    for (const categoryId of repairCategoryIds) {
      const usage = getCategoryEmojiUsage(
        expandedPuzzles.filter((puzzle) => puzzle.categoryId === categoryId),
      );
      for (const [emoji, summary] of usage) {
        if (summary.ratio > 0.2) {
          warnings.push({ categoryId, emoji, count: summary.count, ratio: summary.ratio });
        }
      }
    }
    expect(warnings).toEqual([{ categoryId: "math", emoji: "🧩", count: 5, ratio: 0.25 }]);
  });
});

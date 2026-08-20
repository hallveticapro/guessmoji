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
    id: "construction-bulldozer",
    categoryId: "construction",
    answer: "Bulldozer",
    difficulty: "medium",
    emojis: "🛞🪒🟫➡️",
    hint: "A tracked earthmover uses a wide front blade to push soil into piles.",
    explanation:
      "🛞 gives the continuous tread idea, 🪒 stands for the broad blade edge, 🟫 gives loose soil, and ➡️ shows the forward pushing action.",
    details: "Type: Construction equipment",
    funFact: "Bulldozers use a broad blade at the front.",
    tags: ["machines", "construction"],
  },
  {
    id: "construction-dump-truck",
    categoryId: "construction",
    answer: "Dump Truck",
    difficulty: "easy",
    emojis: "🛞📦🪨↘️",
    hint: "A road hauler empties a raised cargo box by tipping it.",
    explanation:
      "🛞 signals a road vehicle, 📦 gives the raised cargo body, 🪨 is the rough load, and ↘️ shows the box tipping its contents out.",
    details: "Type: Construction vehicle",
    funFact: "Dump trucks use hydraulics to lift the bed.",
    tags: ["machines", "construction"],
  },
  {
    id: "construction-wheelbarrow",
    categoryId: "construction",
    answer: "Wheelbarrow",
    difficulty: "medium",
    emojis: "🪣🤲🪵⚖️➡️",
    hint: "A hand-pushed garden carrier keeps its load balanced between two handles.",
    explanation:
      "🪣 gives the carried material, 🤲 gives the handles and human effort, 🪵 gives the frame, ⚖️ gives the balancing act, and ➡️ shows the one-person push.",
    details:
      "Hand-powered cart with one wheel and handles used for soil, concrete, or debris.",
    funFact:
      "One wheel makes a wheelbarrow easy to turn but requires the user to balance the load.",
    tags: ["construction", "tool", "material-handling", "landscaping"],
  },
  {
    id: "construction-scaffolding",
    categoryId: "construction",
    answer: "Scaffolding",
    difficulty: "medium",
    emojis: "🏢🔲🧍⬆️↔️",
    hint: "A temporary frame lets workers stand outside a building at height.",
    explanation:
      "🏢 gives the building being serviced, 🔲 gives the open temporary frame, 🧍 is the worker, ⬆️ gives working height, and ↔️ gives the platform's span.",
    details:
      "Temporary platform and frame system used to support workers and materials at height.",
    funFact:
      "Scaffolding is assembled in sections and must be properly braced and supported.",
    tags: ["construction", "site", "safety", "building"],
  },
  {
    id: "construction-nail-gun",
    categoryId: "construction",
    answer: "Nail Gun",
    difficulty: "medium",
    emojis: "🪵📐🧰⚡↘️",
    hint: "A powered framing tool rapidly drives fasteners into boards.",
    explanation:
      "🪵 gives the boards, 📐 gives framing geometry, 🧰 gives the handheld tool, ⚡ gives powered repetition, and ↘️ gives the driving motion into the wood.",
    details:
      "Tool that uses compressed air, gas, or electricity to drive nails into material.",
    funFact:
      "Different nail-gun types are designed for framing, finishing, roofing, or small trim work.",
    tags: ["construction", "tool", "woodworking", "safety"],
  },
  {
    id: "construction-work-gloves",
    categoryId: "construction",
    answer: "Work Gloves",
    difficulty: "medium",
    emojis: "🖐️🪨🛡️🧰",
    hint: "Protective handwear helps grip rough materials on a job site.",
    explanation:
      "🖐️ identifies the hand being covered, 🪨 gives rough masonry or aggregate, 🛡️ gives protection, and 🧰 gives the work-site task.",
    details:
      "Hand protection selected for tasks such as handling lumber, masonry, tools, or sharp materials.",
    funFact:
      "Different jobs require different glove materials because no single glove protects against every hazard.",
    tags: ["construction", "safety", "workwear", "ppe"],
  },
  {
    id: "jobs-designer",
    categoryId: "jobs",
    answer: "Designer",
    difficulty: "medium",
    emojis: "💡🖊️🧩👀📱",
    hint: "A creative job turns rough ideas into useful visual or interactive solutions.",
    explanation:
      "💡 gives the idea, 🖊️ gives the sketch, 🧩 gives the constraints, 👀 gives user observation, and 📱 gives a visual or interactive product being designed.",
    details:
      "Professional who develops visual, product, or interaction solutions for a defined purpose and audience.",
    funFact:
      "Designers often test rough ideas with sketches or prototypes before producing a final version.",
    tags: ["jobs", "design", "product", "user-experience"],
  },
  {
    id: "music-instruments-banjo",
    categoryId: "music-instruments",
    answer: "Banjo",
    difficulty: "medium",
    emojis: "⭕🪵🫳🌾",
    hint: "A plucked string instrument with a drum-like round body appears in bluegrass.",
    explanation:
      "⭕ gives the round drum-like body, 🪵 gives its wooden body and neck, 🫳 gives plucking, and 🌾 evokes the bluegrass setting.",
    details: "Type: Plucked string instrument",
    funFact: "Many banjos use a circular, drum-like body under their strings.",
    tags: ["music", "instruments", "string", "folk"],
  },
  {
    id: "music-genres-randb",
    categoryId: "music-genres",
    answer: "R&B",
    difficulty: "medium",
    emojis: "🎙️🎹🎛️🔁",
    hint: "A smooth vocal style blends keyboard harmony with a repeating studio groove.",
    explanation:
      "🎙️ gives expressive vocals, 🎹 gives keyboard harmony, 🎛️ gives produced studio sound, and 🔁 gives the repeating groove.",
    details: "Type: Music genre",
    funFact: "Rhythm and blues helped shape later soul, funk, and pop music.",
    tags: ["music", "genres", "r-and-b"],
  },
  {
    id: "national-parks-great-sand-dunes-national-park-and-preserve",
    categoryId: "national-parks",
    answer: "Great Sand Dunes National Park and Preserve",
    difficulty: "hard",
    emojis: "🟤〰️🏔️📏",
    hint: "A Colorado protected landscape pairs towering wind-shaped ridges with high mountains.",
    explanation:
      "🟤 gives loose sand, 〰️ gives the dune ridges, 🏔️ gives the mountain backdrop, and 📏 gives the dunes' exceptional height.",
    details: "Established 2004",
    funFact: "It protects the tallest dunes in North America.",
    tags: ["national-parks", "colorado", "dunes"],
  },
  {
    id: "winter-holidays-hanukkiah",
    categoryId: "winter-holidays",
    answer: "Hanukkiah",
    difficulty: "hard",
    emojis: "9️⃣🕯️➕8️⃣",
    hint:
      "The nine-branched holiday candelabrum uses eight lights plus a separate helper; its Hebrew-derived name distinguishes it from the seven-branched temple lamp.",
    explanation:
      "9️⃣ gives the nine branches, 🕯️ gives the individual candles, ➕ gives the separate helper light, and 8️⃣ recalls the eight holiday nights.",
    details:
      "Type: Holiday object; the nine-branched Hanukkah candelabrum is called a hanukkiah.",
    funFact: "A Hanukkah hanukkiah has eight lights plus a separate helper light.",
    tags: ["holidays", "winter", "winter-holidays"],
  },
  {
    id: "summer-fun-camping-trip",
    categoryId: "summer-fun",
    answer: "Camping Trip",
    difficulty: "easy",
    emojis: "🚗🌲🛌🌌",
    hint: "An overnight getaway sleeps outside amid trees and stars.",
    explanation:
      "🚗 gives the trip, 🌲 gives the natural setting, 🛌 gives overnight sleep, and 🌌 gives the open-air night.",
    details: "Type: Outdoor trip",
    funFact: "Camping can happen in tents, cabins, or under the stars.",
    tags: ["summer", "summer-fun"],
  },
  {
    id: "beach-day-surfboard",
    categoryId: "beach-day",
    answer: "Surfboard",
    difficulty: "easy",
    emojis: "🪵📏〰️⚖️",
    hint: "This gear keeps a standing rider balanced as waves break underneath.",
    explanation:
      "🪵 gives the board surface, 📏 gives its elongated shape, 〰️ gives breaking waves, and ⚖️ gives the balance needed while riding.",
    details: "Type: Beach gear",
    funFact: "Surfboards come in different shapes for different waves.",
    tags: ["beach", "summer", "beach-day"],
  },
  {
    id: "beach-day-flip-flops",
    categoryId: "beach-day",
    answer: "Flip-Flops",
    difficulty: "medium",
    emojis: "👣🧵🔊↔️",
    hint: "Open footwear uses a narrow strap and makes a familiar slap on alternating steps.",
    explanation:
      "👣 gives the pair of feet, 🧵 gives the thin strap, 🔊 gives the characteristic slap, and ↔️ gives the alternating steps.",
    details: "Type: Footwear",
    funFact: "Flip-flops are named for the sound they make while walking.",
    tags: ["beach", "summer", "beach-day"],
  },
  {
    id: "amusement-park-mascot",
    categoryId: "amusement-park",
    answer: "Mascot",
    difficulty: "easy",
    emojis: "🎭🏷️🤝📸",
    hint: "A costumed representative of a team or place greets visitors and poses for photos.",
    explanation:
      "🎭 gives the costume, 🏷️ gives the represented identity, 🤝 gives the welcome, and 📸 gives the visitor photo moment.",
    details: "Type: Park role",
    funFact: "A mascot gives a place or team a recognizable character for visitors to meet.",
    tags: ["amusement-park", "people", "character"],
  },
  {
    id: "around-the-house-shower",
    categoryId: "around-the-house",
    answer: "Shower",
    difficulty: "easy",
    emojis: "💧⬆️🔧🧼",
    hint: "A bathroom fixture sends water down from an overhead spray while someone washes.",
    explanation:
      "💧 gives the water, ⬆️ gives the overhead direction, 🔧 gives the plumbing hardware, and 🧼 gives the washing purpose.",
    details: "Type: Bathroom fixture",
    funFact: "Shower temperature and pressure can be adjusted for comfort and cleaning.",
    tags: ["home", "bathroom", "cleaning"],
  },
  {
    id: "kitchen-tools-ladle",
    categoryId: "kitchen-tools",
    answer: "Ladle",
    difficulty: "medium",
    emojis: "🍲🪵🫗🥣",
    hint: "A deep scoop on a long handle transfers hot liquid from pot to bowl.",
    explanation:
      "🍲 gives the soup pot, 🪵 gives the long handle, 🫗 gives the serving pour, and 🥣 gives the receiving bowl.",
    details: "Type: Serving tool",
    funFact: "A ladle’s deep bowl holds more liquid than a typical spoon.",
    tags: ["kitchen", "tools", "serving"],
  },
  {
    id: "kitchen-tools-citrus-juicer",
    categoryId: "kitchen-tools",
    answer: "Citrus Juicer",
    difficulty: "medium",
    emojis: "🤲🧩💧🫙",
    hint: "A hand press extracts tart juice from a halved, segmented fruit.",
    explanation:
      "🤲 gives the hand press, 🧩 gives the fruit's separated segments, 💧 gives the released juice, and 🫙 gives the collecting container.",
    details: "Type: Prep tool",
    funFact: "A reamer or cone extracts juice when cut citrus is pressed against it.",
    tags: ["kitchen", "tools", "prep"],
  },
  {
    id: "kitchen-tools-potato-masher",
    categoryId: "kitchen-tools",
    answer: "Potato Masher",
    difficulty: "medium",
    emojis: "🤲⬇️🕳️🍽️",
    hint: "A perforated plate presses cooked root vegetables into a soft side dish.",
    explanation:
      "🤲 gives the hand tool, ⬇️ gives the pressing action, 🕳️ gives the perforated plate, and 🍽️ gives the prepared side dish.",
    details: "Type: Prep tool",
    funFact: "A masher’s perforated plate pushes cooked food into a soft texture.",
    tags: ["kitchen", "tools", "prep"],
  },
  {
    id: "idioms-through-thick-and-thin",
    categoryId: "idioms",
    answer: "Through Thick and Thin",
    difficulty: "medium",
    emojis: "🤝🧱🧵🌦️",
    hint: "An expression for remaining loyal in both hard and easy circumstances.",
    explanation:
      "🤝 gives loyalty, 🧱 gives something thick, 🧵 gives something thin, and 🌦️ gives the changing conditions a companion can endure.",
    details: "Type: Idiom",
    funFact: "The phrase describes staying with someone through changing conditions.",
    tags: ["phrases", "idioms"],
  },
] as const;

const categoryContextBans: Record<string, readonly string[]> = {
  construction: ["🏗️"],
  jobs: ["🧰"],
  "music-instruments": ["🎸"],
  "music-genres": ["🎧"],
  "national-parks": ["🏞️"],
  "winter-holidays": ["❄️"],
  "summer-fun": ["☀️"],
  "beach-day": ["🏖️"],
  "amusement-park": ["🎡"],
  "around-the-house": ["🏠"],
  "kitchen-tools": ["🍳"],
  idioms: ["🧩"],
};

function getPuzzle(id: string) {
  const puzzle = expandedPuzzles.find((candidate) => candidate.id === id);
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

describe("partition C blind recheck 2 final calibration", () => {
  it("applies all 20 approved C actions exactly once", () => {
    expect(finalCalibrationManifest).toHaveLength(20);
    expect(new Set(finalCalibrationManifest.map((card) => card.id)).size).toBe(20);

    for (const expected of finalCalibrationManifest) {
      expect(getPuzzle(expected.id)).toMatchObject(expected);
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

      const normalizedHint = normalizeAnswerForAudit(puzzle.hint);
      expect(normalizedHint).not.toContain(normalizeAnswerForAudit(puzzle.answer));
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

  it("keeps each calibrated clue distinct from every same-category clue", () => {
    for (const expected of finalCalibrationManifest) {
      const puzzle = getPuzzle(expected.id);
      const sameCategory = expandedPuzzles.filter(
        (candidate) => candidate.categoryId === puzzle.categoryId && candidate.id !== puzzle.id,
      );

      for (const other of sameCategory) {
        expect(puzzle.emojis, `${puzzle.id}/${other.id} exact clue`).not.toBe(other.emojis);
      }
    }
  });

  it("keeps affected category repetition at or below the review threshold", () => {
    const affectedCategoryIds = new Set(finalCalibrationManifest.map((card) => card.categoryId));
    const acceptedExistingWarnings: Record<string, readonly string[]> = {
      "winter-holidays": ["✨"],
      "beach-day": ["🪨"],
    };

    for (const categoryId of affectedCategoryIds) {
      const usage = getCategoryEmojiUsage(
        expandedPuzzles.filter((puzzle) => puzzle.categoryId === categoryId),
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

  it("keeps the integrated C catalog invariant-clean and the replacement clues answer-safe", () => {
    expect(findDirectAnswerEmojiLeaks(puzzles, answerEmojiBanlist)).toEqual([]);
    expect(findContentInvariantViolations(categories, puzzles)).toEqual([]);

    for (const expected of finalCalibrationManifest) {
      const clueSet = normalizedEmojiSet(getPuzzle(expected.id).emojis);
      expect(clueSet.size).toBeGreaterThanOrEqual(3);
      expect(getPuzzle(expected.id).explanation?.trim()).toBeTruthy();
    }
  });
});

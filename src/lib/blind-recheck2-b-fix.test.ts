import { describe, expect, it } from "vitest";
import { answerEmojiBanlist } from "@/data/answerEmojiBanlist";
import { categories } from "@/data/categories";
import { expandedPuzzles } from "@/data/expandedPacks";
import { puzzles } from "@/data/puzzles";
import { findDirectAnswerEmojiLeaks, normalizeAnswerForAudit } from "@/lib/clue-audit";
import { findContentInvariantViolations } from "@/lib/content-audit";

const finalCalibrationManifest = [
  {
    id: "sports-bowling",
    categoryId: "sports",
    answer: "Bowling",
    difficulty: "medium",
    emojis: "🛤️⚪🔟↘️🧮",
    hint: "Players take turns aiming at ten upright targets from a marked lane, then score each frame.",
    explanation: "🛤️ gives the lane; ⚪ is the rolled ball; 🔟 gives the ten-target rack; ↘️ shows the delivery; 🧮 represents frame scoring.",
  },
  {
    id: "math-graph",
    categoryId: "math",
    answer: "Line Graph",
    difficulty: "medium",
    emojis: "📋↕️🔵🔗🕒",
    hint: "A data display joins plotted values in order so a change over time is easy to follow.",
    details: "Type: Data display that connects values in sequence",
    funFact: "Line graphs are especially useful for showing change over time.",
    tags: ["math", "data", "line-graph"],
    explanation: "📋 is the data sheet; ↕️ is the value scale; 🔵 are plotted points; 🔗 joins the points; 🕒 gives their ordered time sequence.",
  },
  {
    id: "math-decimal",
    categoryId: "math",
    answer: "Decimal",
    difficulty: "easy",
    emojis: "1️⃣🔸5️⃣🔟",
    hint: "Place-value notation puts tenths or hundredths after a separator.",
    explanation: "1️⃣ is the whole-number digit; 🔸 is the separator; 5️⃣ is a fractional digit; 🔟 marks the base-ten system.",
  },
  {
    id: "math-square",
    categoryId: "math",
    answer: "Square",
    difficulty: "easy",
    emojis: "🧩📐⚖️4️⃣",
    hint: "Its four sides match, and every corner is a right angle.",
    explanation: "🧩 gives a tile-like shape; 📐 marks right-angle corners; ⚖️ shows equal side lengths; 4️⃣ counts the four matching sides.",
  },
  {
    id: "books-the-bfg",
    categoryId: "books",
    answer: "The BFG",
    difficulty: "medium",
    emojis: "🧍‍♂️📏💭🫙🗣️",
    hint: "A kind, towering visitor collects dreams in jars and speaks in playful made-up words.",
    explanation: "🧍‍♂️📏 show the visitor's unusual height; 💭 are the dreams; 🫙 holds them; 🗣️ signals the visitor's playful invented speech.",
  },
  {
    id: "world-landmarks-victoria-memorial",
    categoryId: "world-landmarks",
    answer: "Victoria Memorial",
    difficulty: "medium",
    emojis: "🏛️🖼️🇬🇧🇮🇳🌆",
    hint: "A Kolkata museum in formal gardens commemorates a British monarch.",
    explanation: "🏛️ is the landmark building; 🖼️ signals its museum; 🇬🇧 gives the British royal connection; 🇮🇳 locates India; 🌆 gives the Kolkata city setting.",
  },
  {
    id: "us-landmarks-washington-monument",
    categoryId: "us-landmarks",
    answer: "Washington Monument",
    difficulty: "easy",
    emojis: "🏛️📏🔺💧🌳",
    hint: "A pointed stone obelisk rises beside the reflecting pool on the National Mall.",
    explanation: "🏛️ gives the civic landmark; 📏 emphasizes its height; 🔺 gives the pointed obelisk profile; 💧 is the reflecting pool; 🌳 evokes the National Mall grounds.",
  },
  {
    id: "us-landmarks-mount-vernon",
    categoryId: "us-landmarks",
    answer: "Mount Vernon",
    difficulty: "medium",
    emojis: "🌊🌳🏡🪖1️⃣",
    hint: "A Virginia estate beside the Potomac preserves the home of the nation's first president.",
    explanation: "🌊 is the Potomac setting; 🌳 are the estate grounds; 🏡 is the preserved residence; 🪖 recalls its owner's Revolutionary-era military service; 1️⃣ marks his role as the nation's first president.",
  },
  {
    id: "world-geography-europe",
    categoryId: "world-geography",
    answer: "Europe",
    difficulty: "easy",
    emojis: "🗺️🏛️🇫🇷🇩🇪🏰",
    hint: "A continent west of Asia joins many languages, countries, and historic cities.",
    explanation: "🗺️ gives continental scale; 🏛️ represents historic cities; 🇫🇷 and 🇩🇪 are two neighboring examples; 🏰 evokes shared European architectural heritage.",
  },
] as const;

function getPuzzle(id: string) {
  const puzzle = expandedPuzzles.find((candidate) => candidate.id === id);
  expect(puzzle, `${id} should exist`).toBeDefined();
  return puzzle!;
}

describe("partition B recheck 2 final calibration", () => {
  it("applies all nine approved card actions without changing source IDs", () => {
    expect(finalCalibrationManifest).toHaveLength(9);
    expect(new Set(finalCalibrationManifest.map((card) => card.id)).size).toBe(9);

    for (const expected of finalCalibrationManifest) {
      expect(getPuzzle(expected.id)).toMatchObject(expected);
    }
  });

  it("keeps the Line Graph replacement unique and durably bans its direct pictograms", () => {
    const mathGraph = getPuzzle("math-graph");

    expect(mathGraph.answer).toBe("Line Graph");
    expect(answerEmojiBanlist["line graph"]).toEqual(["📈", "📊"]);
    expect(findDirectAnswerEmojiLeaks(puzzles, answerEmojiBanlist)).toEqual([]);
    expect(
      puzzles.filter((puzzle) => puzzle.categoryId === "math" && normalizeAnswerForAudit(puzzle.answer) === "line graph"),
    ).toHaveLength(1);
  });

  it("keeps deterministic content invariants clean after the replacements", () => {
    expect(expandedPuzzles).toHaveLength(1130);
    expect(new Set(expandedPuzzles.map((puzzle) => puzzle.id)).size).toBe(1130);
    expect(findContentInvariantViolations(categories, puzzles)).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { expandedPuzzles } from "@/data/expandedPacks";
import { puzzles } from "@/data/puzzles";

const repairedCards = [
  ["disney-movies", "Meet the Robinsons", "👦🚀🕰️👨‍👩‍👧‍👦"],
  ["marvel", "Loki (Marvel)", "👑⏳🎭🌀"],
  ["star-wars", "Millennium Falcon", "🛸🎲🧰🧭"],
  ["video-game-movies", "Pokémon the Movie: I Choose You!", "🧢🔴⚪🐭👣"],
  ["kid-tv-shows", "Rugrats", "👶👶🧸🍼🏠"],
  ["animated-classics", "Sing", "🎤🐷🦍🐭🎭"],
  ["animals", "Fox", "🟠🦴🕳️👂"],
  ["ocean-animals", "Pufferfish", "🎈🪸💨⚠️"],
  ["dinosaurs", "Therizinosaurus", "🪶🪝📏🌾"],
  ["birds", "Peregrine Falcon", "💨⬇️🎯👁️"],
  ["fruit", "Honeydew", "🟢🧊🥄🔪"],
  ["vegetables", "Peas", "📏👐🔘🔘"],
  ["desserts", "Cupcake", "🌀🟫🧺"],
  ["snacks", "Fruit Snacks", "🌈🎒🧃🧩"],
  ["breakfast", "Breakfast Casserole", "🟡🧩🫕🔥"],
] as const;

describe("partition A blind-review repairs", () => {
  it("uses the reviewed answer-specific clues for representative repaired cards", () => {
    const sourcePuzzles = [...puzzles, ...expandedPuzzles];

    for (const [categoryId, answer, emojis] of repairedCards) {
      const puzzle = sourcePuzzles.find(
        (candidate) => candidate.categoryId === categoryId && candidate.answer === answer,
      );
      expect(puzzle, `${categoryId}:${answer} should exist`).toBeDefined();
      expect(puzzle?.emojis, `${categoryId}:${answer} clue`).toBe(emojis);
    }
  });
});

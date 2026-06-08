// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GameBoard } from "@/components/game/GameBoard";
import type { Category, Puzzle } from "@/types/puzzle";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const categories = [
  {
    id: "pixar",
    name: "Pixar",
    slug: "pixar",
    description: "Animated favorites.",
    icon: "🚀",
  },
  {
    id: "random-mix",
    name: "Random Mix",
    slug: "random-mix",
    description: "A shuffled mix.",
    icon: "🎲",
  },
] satisfies Category[];

const puzzle = {
  id: "toy-story",
  answer: "Toy Story",
  emojis: "🤠🚀🧸",
  categoryId: "pixar",
  difficulty: "easy",
  hint: "Toys go on adventures.",
  details: "Released: 1995",
  explanation: "Cowboy, space ranger, and toys point to Toy Story.",
  funFact: "Toy Story was Pixar's first feature film.",
  tags: ["pixar"],
} satisfies Puzzle;

describe("GameBoard", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("shows the source category on a revealed Random Mix card", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <GameBoard
          category={categories[1]}
          categories={categories}
          initialPuzzles={[puzzle]}
          sessionPuzzleCount={1}
        />,
      );
    });

    expect(container.textContent).not.toContain("From: Pixar");

    await act(async () => {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 0);
      });
    });

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    });

    expect(container.textContent).toContain("From: Pixar");

    await act(async () => {
      root.unmount();
    });
    container.remove();
  });
});

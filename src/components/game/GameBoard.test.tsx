// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GameBoard } from "@/components/game/GameBoard";
import { ROUND_HISTORY_STORAGE_KEY } from "@/components/game/round-history-storage";
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

const sourcePuzzles = Array.from({ length: 20 }, (_, index) => ({
  ...puzzle,
  id: `source-${index + 1}`,
  answer: `Source answer ${index + 1}`,
  categoryId: "pixar",
})) satisfies Puzzle[];

describe("GameBoard", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("hides the Random Mix source category until answer reveal", async () => {
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

    expect(container.textContent).not.toContain("Pixar");
    expect(container.textContent).not.toContain("Toy Story");

    await act(async () => {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 0);
      });
    });

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    });

    expect(container.textContent).toContain("Category");
    expect(container.textContent).toContain("Pixar");
    expect(container.textContent).toContain("Toy Story");

    await act(async () => {
      root.unmount();
    });
    container.remove();
  });

  it("limits a source category to a ten-card round", async () => {
    const { container, root } = renderGameBoard(
      categories[0],
      sourcePuzzles,
    );

    await flushEffects();

    expect(container.textContent).toContain("1 / 10");

    await unmountGameBoard(root, container);
  });

  it("starts a new source round with cards not seen in the first round", async () => {
    const { container, root } = renderGameBoard(
      categories[0],
      sourcePuzzles,
    );

    await flushEffects();
    expect(container.textContent).toContain("1 / 10");
    const firstRoundIds = await revealRound(container, sourcePuzzles.length / 2);

    expect(container.textContent).toContain("Category complete");

    await act(async () => {
      clickButton(container, "Play Again");
    });
    const secondRoundIds = await revealRound(container, sourcePuzzles.length / 2);

    expect(secondRoundIds.filter((id) => firstRoundIds.includes(id))).toEqual([]);

    await unmountGameBoard(root, container);
  });

  it("does not consume a source round when the timer changes", async () => {
    const { container, root } = renderGameBoard(
      categories[0],
      sourcePuzzles,
    );

    await flushEffects();
    const historyBeforeTimerChange = window.localStorage.getItem(
      ROUND_HISTORY_STORAGE_KEY,
    );

    await act(async () => {
      clickButton(container, "Open game settings");
    });
    await act(async () => {
      changeTimerInput(container, "30");
      clickButton(container, "Apply");
    });
    await flushEffects();

    expect(window.localStorage.getItem(ROUND_HISTORY_STORAGE_KEY)).toBe(
      historyBeforeTimerChange,
    );
    expect(container.textContent).toContain("1 / 10");

    await unmountGameBoard(root, container);
  });

  it("keeps the timer stopped when duration changes after revealing an answer", async () => {
    vi.useFakeTimers();
    const { container, root } = renderGameBoard(
      categories[0],
      sourcePuzzles,
    );

    try {
      await flushFakeEffects();
      await act(async () => {
        clickButton(container, "Open game settings");
      });
      await act(async () => {
        changeTimerInput(container, "30");
        clickButton(container, "Apply");
      });
      await flushFakeEffects();

      await act(async () => {
        clickButton(container, "Reveal");
      });
      await act(async () => {
        clickButton(container, "Open game settings");
      });
      await act(async () => {
        changeTimerInput(container, "45");
        clickButton(container, "Apply");
      });

      const timerBeforeTick = readDisplayedTimer(container);
      expect(timerBeforeTick).not.toBeNull();

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(readDisplayedTimer(container)).toBe(timerBeforeTick);
    } finally {
      await unmountGameBoard(root, container);
      vi.useRealTimers();
    }
  });

  it("restarts the current source round without consuming another block", async () => {
    const { container, root } = renderGameBoard(
      categories[0],
      sourcePuzzles,
    );

    await flushEffects();
    const currentRoundIds = readStoredCategoryIds("pixar");

    await act(async () => {
      clickButton(container, "Reveal");
    });
    await act(async () => {
      clickButton(container, "Next");
    });
    await act(async () => {
      clickButton(container, "Open game settings");
    });
    await act(async () => {
      clickButton(container, "Restart");
    });
    await act(async () => {
      clickButton(container, "Reveal");
    });

    expect(container.querySelector("h2")?.textContent?.trim()).toBe(
      "Source answer 1",
    );
    expect(readStoredCategoryIds("pixar")).toEqual(currentRoundIds);

    await unmountGameBoard(root, container);
  });

  it("preserves source history across remounts and resets after a full cycle", async () => {
    const firstRender = renderGameBoard(categories[0], sourcePuzzles);
    await flushEffects();
    const firstRoundIds = readStoredCategoryIds("pixar");
    await unmountGameBoard(firstRender.root, firstRender.container);

    const secondRender = renderGameBoard(categories[0], sourcePuzzles);
    await flushEffects();
    const secondRoundIds = readStoredCategoryIds("pixar");
    await unmountGameBoard(secondRender.root, secondRender.container);

    const thirdRender = renderGameBoard(categories[0], sourcePuzzles);
    await flushEffects();
    const thirdRoundIds = readStoredCategoryIds("pixar");

    expect(secondRoundIds).toHaveLength(sourcePuzzles.length);
    expect(secondRoundIds.slice(0, firstRoundIds.length)).toEqual(firstRoundIds);
    expect(thirdRoundIds).toEqual(firstRoundIds);

    await unmountGameBoard(thirdRender.root, thirdRender.container);
  });

  it("keeps the same source round cards when Shuffle is used", async () => {
    const { container, root } = renderGameBoard(
      categories[0],
      sourcePuzzles,
    );

    await flushEffects();
    expect(container.textContent).toContain("1 / 10");
    const originalIds = await revealRound(container, sourcePuzzles.length / 2, false);

    await act(async () => {
      clickButton(container, "Open game settings");
    });
    await act(async () => {
      clickButton(container, "Shuffle");
    });

    const shuffledIds = await revealRound(container, sourcePuzzles.length / 2, false);

    expect(new Set(shuffledIds)).toEqual(new Set(originalIds));

    await unmountGameBoard(root, container);
  });

  it("recovers from malformed source history storage", async () => {
    window.localStorage.setItem(ROUND_HISTORY_STORAGE_KEY, "not-json");

    const { container, root } = renderGameBoard(
      categories[0],
      sourcePuzzles,
    );

    await flushEffects();

    expect(container.textContent).toContain("1 / 10");
    const document = JSON.parse(
      window.localStorage.getItem(ROUND_HISTORY_STORAGE_KEY) ?? "{}",
    ) as { categories?: Record<string, string[]> };
    expect(document.categories?.pixar).toHaveLength(10);

    await unmountGameBoard(root, container);
  });

  it("keeps Random Mix at its configured ten-card session count", async () => {
    const randomMixPuzzles = Array.from({ length: 25 }, (_, index) => ({
      ...puzzle,
      id: `mix-${index + 1}`,
      answer: `Mix answer ${index + 1}`,
      categoryId: "pixar",
    })) satisfies Puzzle[];
    const { container, root } = renderGameBoard(
      categories[1],
      randomMixPuzzles,
      10,
    );

    await flushEffects();

    expect(container.textContent).toContain("1 / 10");
    expect(window.localStorage.getItem(ROUND_HISTORY_STORAGE_KEY)).toBeNull();

    await unmountGameBoard(root, container);
  });
});

function renderGameBoard(
  category: Category,
  initialPuzzles: Puzzle[],
  sessionPuzzleCount?: number,
) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <GameBoard
        category={category}
        categories={categories}
        initialPuzzles={initialPuzzles}
        sessionPuzzleCount={sessionPuzzleCount}
      />,
    );
  });

  return { container, root };
}

function changeTimerInput(container: HTMLElement, value: string) {
  const input = container.querySelector<HTMLInputElement>("#timer-seconds");
  if (!input) {
    throw new Error("Could not find timer input");
  }

  const setValue = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  setValue?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function readStoredCategoryIds(categoryId: string) {
  const storedDocument = JSON.parse(
    window.localStorage.getItem(ROUND_HISTORY_STORAGE_KEY) ?? "{}",
  ) as { categories?: Record<string, string[]> };

  return storedDocument.categories?.[categoryId] ?? [];
}

function readDisplayedTimer(container: HTMLElement) {
  return Array.from(container.querySelectorAll("p")).find((candidate) =>
    /^\d+s$/.test(candidate.textContent?.trim() ?? ""),
  )?.textContent?.trim();
}

async function flushEffects() {
  await act(async () => {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 0);
    });
  });
}

async function flushFakeEffects() {
  await act(async () => {
    vi.advanceTimersByTime(0);
  });
}

async function revealRound(
  container: HTMLElement,
  count: number,
  finish = true,
) {
  const ids: string[] = [];

  for (let index = 0; index < count; index += 1) {
    await act(async () => {
      clickButton(container, "Reveal");
    });
    ids.push(container.querySelector("h2")?.textContent?.trim() ?? "");

    if (index < count - 1 || finish) {
      await act(async () => {
        clickButton(container, index === count - 1 ? "Finish" : "Next");
      });
    }
  }

  return ids;
}

function clickButton(container: HTMLElement, label: string) {
  const button = Array.from(container.querySelectorAll("button")).find(
    (candidate) =>
      candidate.textContent?.trim() === label ||
      candidate.getAttribute("aria-label") === label,
  );

  if (!button) {
    throw new Error(`Could not find button: ${label}`);
  }

  button.click();
}

async function unmountGameBoard(
  root: ReturnType<typeof createRoot>,
  container: HTMLElement,
) {
  await act(async () => {
    root.unmount();
  });
  container.remove();
}

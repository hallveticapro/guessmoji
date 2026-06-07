// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { EmojiClue } from "./EmojiClue";
import { MIN_EMOJI_FONT_SIZE } from "./emoji-fit";

describe("EmojiClue", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders without throwing when ResizeObserver is unavailable", () => {
    const originalResizeObserver = window.ResizeObserver;
    Reflect.deleteProperty(window, "ResizeObserver");

    const container = document.createElement("div");
    document.body.append(container);

    expect(() => {
      act(() => {
        createRoot(container).render(<EmojiClue emojis="🌋🧊🏔️🧭" />);
      });
    }).not.toThrow();

    const clue = container.querySelector("p");

    expect(clue?.textContent).toBe("🌋🧊🏔️🧭");
    expect(clue?.className).toContain("whitespace-nowrap");
    expect(clue?.style.fontSize).toBe(`${MIN_EMOJI_FONT_SIZE}px`);

    if (originalResizeObserver) {
      window.ResizeObserver = originalResizeObserver;
    }
  });
});

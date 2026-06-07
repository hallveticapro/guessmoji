import { describe, expect, it } from "vitest";
import { getGameKeyboardAction } from "@/components/game/keyboard";

const baseState = {
  isAnswerVisible: false,
  isComplete: false,
  isSettingsOpen: false,
};

describe("game keyboard shortcuts", () => {
  it("uses Space to toggle the answer without choosing next", () => {
    expect(getGameKeyboardAction(" ", baseState)).toBe("toggle-answer");
    expect(
      getGameKeyboardAction(" ", {
        ...baseState,
        isAnswerVisible: true,
      }),
    ).toBe("toggle-answer");
  });

  it("uses ArrowRight only for moving next", () => {
    expect(getGameKeyboardAction("ArrowRight", baseState)).toBe("next");
    expect(
      getGameKeyboardAction("ArrowRight", {
        ...baseState,
        isAnswerVisible: true,
      }),
    ).toBe("next");
  });

  it("uses ArrowLeft for previous", () => {
    expect(getGameKeyboardAction("ArrowLeft", baseState)).toBe("previous");
  });

  it("only allows hint toggling while the answer is hidden", () => {
    expect(getGameKeyboardAction("h", baseState)).toBe("hint");
    expect(
      getGameKeyboardAction("H", {
        ...baseState,
        isAnswerVisible: true,
      }),
    ).toBeNull();
  });

  it("maps shuffle, restart, and fullscreen shortcuts", () => {
    expect(getGameKeyboardAction("s", baseState)).toBe("shuffle");
    expect(getGameKeyboardAction("R", baseState)).toBe("restart");
    expect(getGameKeyboardAction("f", baseState)).toBe("fullscreen");
  });

  it("closes settings before hiding clues on Escape", () => {
    expect(
      getGameKeyboardAction("Escape", {
        ...baseState,
        isSettingsOpen: true,
      }),
    ).toBe("close-settings");
    expect(getGameKeyboardAction("Escape", baseState)).toBe("hide-clues");
  });

  it("ignores game-flow shortcuts when the category is complete", () => {
    expect(
      getGameKeyboardAction("ArrowRight", {
        ...baseState,
        isComplete: true,
      }),
    ).toBeNull();
    expect(
      getGameKeyboardAction("Escape", {
        ...baseState,
        isComplete: true,
      }),
    ).toBe("hide-clues");
  });
});

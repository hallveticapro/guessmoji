import { describe, expect, it } from "vitest";
import {
  getMaxEmojiFontSize,
  MAX_EMOJI_FONT_SIZE,
  supportsResizeObserver,
} from "./emoji-fit";

describe("supportsResizeObserver", () => {
  it("returns false when no window-like object is available", () => {
    expect(supportsResizeObserver(undefined)).toBe(false);
  });

  it("returns false when ResizeObserver is missing", () => {
    expect(supportsResizeObserver({})).toBe(false);
  });

  it("returns true when ResizeObserver is available", () => {
    expect(
      supportsResizeObserver({
        ResizeObserver: class ResizeObserver {},
      }),
    ).toBe(true);
  });
});

describe("getMaxEmojiFontSize", () => {
  it("uses conservative font sizes for narrow containers", () => {
    expect(getMaxEmojiFontSize(360)).toBe(72);
  });

  it("uses the maximum font size for wide containers", () => {
    expect(getMaxEmojiFontSize(1200)).toBe(MAX_EMOJI_FONT_SIZE);
  });
});

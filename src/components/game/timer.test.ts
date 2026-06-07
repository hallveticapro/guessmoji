import { describe, expect, it } from "vitest";
import {
  coerceTimerSeconds,
  MAX_TIMER_SECONDS,
  MIN_TIMER_SECONDS,
} from "./timer";

describe("coerceTimerSeconds", () => {
  it("keeps valid timer values", () => {
    expect(coerceTimerSeconds("15")).toBe(15);
  });

  it("treats Off as zero seconds", () => {
    expect(coerceTimerSeconds("0")).toBe(MIN_TIMER_SECONDS);
  });

  it("clamps negative values to the lower bound", () => {
    expect(coerceTimerSeconds("-1")).toBe(MIN_TIMER_SECONDS);
  });

  it("clamps values above the upper bound", () => {
    expect(coerceTimerSeconds("1000")).toBe(MAX_TIMER_SECONDS);
  });

  it("treats invalid input as off", () => {
    expect(coerceTimerSeconds("not a timer")).toBe(MIN_TIMER_SECONDS);
  });
});

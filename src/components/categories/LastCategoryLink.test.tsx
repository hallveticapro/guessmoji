// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LastCategoryLink } from "./LastCategoryLink";
import { LAST_CATEGORY_SLUG_KEY } from "./last-category";
import type { Category } from "@/types/puzzle";

const categories = [
  {
    id: "pixar",
    name: "Pixar",
    slug: "pixar",
    description: "Pixar movie clues.",
    icon: "💡",
    colorTheme: "amber",
    recommendedGradeBand: "2-6",
  },
] satisfies Category[];

describe("LastCategoryLink", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    container = document.createElement("div");
    document.body.append(container);
  });

  afterEach(() => {
    vi.useRealTimers();
    container.remove();
    window.localStorage.clear();
  });

  it("renders a saved category only when the slug is valid", () => {
    window.localStorage.setItem(LAST_CATEGORY_SLUG_KEY, "pixar");

    act(() => {
      createRoot(container).render(<LastCategoryLink categories={categories} />);
    });
    act(() => {
      vi.runAllTimers();
    });

    expect(container.textContent).toContain("Last played");
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/play/pixar");
    expect(window.localStorage.getItem(LAST_CATEGORY_SLUG_KEY)).toBe("pixar");
  });

  it("hides and clears a stale saved slug", () => {
    window.localStorage.setItem(LAST_CATEGORY_SLUG_KEY, "retired-category");

    act(() => {
      createRoot(container).render(<LastCategoryLink categories={categories} />);
    });
    act(() => {
      vi.runAllTimers();
    });

    expect(container.textContent).not.toContain("Last played");
    expect(container.querySelector("a")).toBeNull();
    expect(window.localStorage.getItem(LAST_CATEGORY_SLUG_KEY)).toBeNull();
  });
});

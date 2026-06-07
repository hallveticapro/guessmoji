import { describe, expect, it } from "vitest";
import { resolveLastCategory } from "./last-category";
import type { Category } from "@/types/puzzle";

const categories = [
  {
    id: "pixar",
    name: "Pixar",
    slug: "pixar",
    description: "Pixar movie clues.",
    icon: "lamp",
    colorTheme: "blue",
    recommendedGradeBand: "2-8",
  },
] satisfies Category[];

describe("resolveLastCategory", () => {
  it("returns the matching category for a valid saved slug", () => {
    expect(resolveLastCategory(categories, "pixar")).toEqual({
      category: categories[0],
      shouldClearSavedSlug: false,
    });
  });

  it("hides and clears a stale saved slug", () => {
    expect(resolveLastCategory(categories, "retired-category")).toEqual({
      category: null,
      shouldClearSavedSlug: true,
    });
  });

  it("does not clear storage when no slug has been saved", () => {
    expect(resolveLastCategory(categories, null)).toEqual({
      category: null,
      shouldClearSavedSlug: false,
    });
  });
});

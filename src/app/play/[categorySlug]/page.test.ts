import { describe, expect, it } from "vitest";
import { categories } from "@/data/categories";
import { getPuzzlesByCategoryId } from "@/lib/puzzles";
import { generateStaticParams } from "./page";

describe("play route catalog aggregation", () => {
  it("generates a static route for every category, including Harry Potter", () => {
    const params = generateStaticParams();

    expect(params).toHaveLength(categories.length);
    expect(params).toContainEqual({ categorySlug: "harry-potter" });
  });

  it("keeps Harry Potter reachable through the derived category data", () => {
    expect(getPuzzlesByCategoryId("harry-potter")).toHaveLength(20);
  });
});

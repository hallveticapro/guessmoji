import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { categories } from "@/data/categories";
import { puzzles } from "@/data/puzzles";
import { buildContentAuditPartitions } from "@/lib/content-audit-packets";
import type { Category, Puzzle } from "@/types/puzzle";

const unevenCategories: Category[] = [
  "alpha",
  "beta",
  "gamma",
  "delta",
].map((id) => ({
  id,
  name: id,
  slug: id,
  description: "Synthetic category for packet balancing.",
}));

const unevenCategoryCardCounts = [10, 30, 10, 20];
const unevenPuzzles: Puzzle[] = unevenCategories.flatMap((category, categoryIndex) =>
  Array.from({ length: unevenCategoryCardCounts[categoryIndex] }, (_, cardIndex) => ({
    id: `${category.id}-card-${cardIndex + 1}`,
    answer: `${category.name} answer ${cardIndex + 1}`,
    emojis: `${categoryIndex + 1}️⃣${cardIndex + 1}️⃣`,
    categoryId: category.id,
    difficulty: "easy",
    hint: `Hint for ${category.name} ${cardIndex + 1}`,
    details: `Details for ${category.name} ${cardIndex + 1}`,
    explanation: `Explanation for ${category.name} ${cardIndex + 1}`,
    funFact: `Fact for ${category.name} ${cardIndex + 1}`,
    tags: [category.id],
  })),
);

describe("content audit packet builder", () => {
  it("partitions every source card into balanced answer-hidden and full views", () => {
    const partitions = buildContentAuditPartitions(categories, puzzles, 3);
    const blindCards = partitions.flatMap((partition) => partition.blindCards);
    const fullCards = partitions.flatMap((partition) => partition.fullCards);
    const sourceCategoryIds = categories
      .filter((category) => category.id !== "random-mix")
      .map((category) => category.id);
    const expectedCardCount = puzzles.filter(
      (puzzle) => puzzle.categoryId !== "random-mix",
    ).length;

    expect(partitions).toHaveLength(3);
    expect(blindCards).toHaveLength(expectedCardCount);
    expect(fullCards).toHaveLength(expectedCardCount);
    expect(new Set(fullCards.map((card) => card.opaqueId)).size).toBe(expectedCardCount);
    expect(JSON.stringify(blindCards)).not.toContain('"answer"');
    expect(JSON.stringify(blindCards)).not.toContain('"id"');
    expect(partitions.flatMap((partition) => partition.categoryIds)).not.toContain("random-mix");
    expect(new Set(partitions.flatMap((partition) => partition.categoryIds))).toEqual(
      new Set(sourceCategoryIds),
    );
    expect(partitions.flatMap((partition) => partition.categoryIds)).toEqual(sourceCategoryIds);
    expect(partitions.flatMap((partition) => partition.categoryIds)).toHaveLength(
      sourceCategoryIds.length,
    );
    const sourceCategoryCounts = sourceCategoryIds.map(
      (categoryId) => puzzles.filter((puzzle) => puzzle.categoryId === categoryId).length,
    );
    const largestCategoryCount = Math.max(...sourceCategoryCounts);
    const partitionSpread =
      Math.max(...partitions.map((partition) => partition.fullCards.length)) -
      Math.min(...partitions.map((partition) => partition.fullCards.length));

    // A packet cannot split a category. The largest category is therefore the
    // natural upper bound for the residual imbalance, rather than a stale
    // catalog-specific constant.
    expect(partitionSpread).toBeLessThanOrEqual(largestCategoryCount);
    expect(fullCards.every((card) => /^audit-card-\d+$/.test(card.opaqueId))).toBe(true);
  });

  it("balances an uneven category expansion while retaining whole-category ownership", () => {
    const partitions = buildContentAuditPartitions(unevenCategories, unevenPuzzles, 3);
    const partitionCardCounts = partitions.map((partition) => partition.fullCards.length);
    const allCategoryIds = partitions.flatMap((partition) => partition.categoryIds);
    const allPuzzleIds = partitions.flatMap((partition) =>
      partition.fullCards.map((card) => card.opaqueId),
    );

    expect(partitions).toHaveLength(3);
    expect(partitionCardCounts).toEqual([10, 30, 30]);
    expect(allCategoryIds).toEqual(unevenCategories.map((category) => category.id));
    expect(new Set(allCategoryIds)).toHaveLength(unevenCategories.length);
    expect(allPuzzleIds).toHaveLength(70);
    expect(new Set(allPuzzleIds)).toHaveLength(70);
    expect(JSON.stringify(partitions.flatMap((partition) => partition.blindCards))).not.toContain(
      '"answer"',
    );
    expect(JSON.stringify(partitions.flatMap((partition) => partition.blindCards))).not.toContain(
      "alpha-card-1",
    );

    for (const partition of partitions) {
      expect(partition.blindCards.map((card) => card.opaqueId)).toEqual(
        partition.fullCards.map((card) => card.opaqueId),
      );
      expect(partition.fullCards).toEqual(
        partition.blindCards.map((card, index) =>
          expect.objectContaining({
            ...card,
            answer: partition.fullCards[index].answer,
          }),
        ),
      );
      expect(Object.keys(partition.hintsByOpaqueId).sort()).toEqual(
        partition.blindCards.map((card) => card.opaqueId).sort(),
      );
    }
  });

  it("preserves category and puzzle source order inside each partition", () => {
    const partitions = buildContentAuditPartitions(categories, puzzles, 3);
    const categoryOrder = new Map(
      categories.map((category, index) => [category.id, index]),
    );

    for (const partition of partitions) {
      const categoryIndexes = partition.categoryIds.map((categoryId) => categoryOrder.get(categoryId));
      expect(categoryIndexes).toEqual([...categoryIndexes].sort((left, right) => left! - right!));

      for (const categoryId of partition.categoryIds) {
        const expectedAnswers = puzzles
          .filter((puzzle) => puzzle.categoryId === categoryId)
          .map((puzzle) => puzzle.answer);
        const actualAnswers = partition.fullCards
          .filter((card) => card.categoryId === categoryId)
          .map((card) => card.answer);

        expect(actualAnswers).toEqual(expectedAnswers);
      }
    }
  });

  it("keeps hints keyed to the same opaque IDs as both card views", () => {
    const partitions = buildContentAuditPartitions(categories, puzzles, 3);

    for (const partition of partitions) {
      expect(Object.keys(partition.hintsByOpaqueId).sort()).toEqual(
        partition.blindCards.map((card) => card.opaqueId).sort(),
      );
      expect(partition.blindCards.map((card) => card.opaqueId)).toEqual(
        partition.fullCards.map((card) => card.opaqueId),
      );

      for (const card of partition.fullCards) {
        expect(partition.hintsByOpaqueId[card.opaqueId]).toBe(card.hint ?? "");
      }
    }
  });

  it("is deterministic for the same source arrays", () => {
    expect(buildContentAuditPartitions(categories, puzzles, 3)).toEqual(
      buildContentAuditPartitions(categories, puzzles, 3),
    );
  });

  it("writes exactly three packet views for each partition when requested", async () => {
    const outputDirectory = process.env.CONTENT_AUDIT_OUTPUT_DIR;
    if (!outputDirectory) {
      return;
    }

    const partitions = buildContentAuditPartitions(categories, puzzles, 3);
    await mkdir(outputDirectory, { recursive: true });

    for (const partition of partitions) {
      await writeFile(
        path.join(outputDirectory, `${partition.id}-blind.json`),
        JSON.stringify(partition.blindCards, null, 2),
        "utf8",
      );
      await writeFile(
        path.join(outputDirectory, `${partition.id}-hints.json`),
        JSON.stringify(partition.hintsByOpaqueId, null, 2),
        "utf8",
      );
      await writeFile(
        path.join(outputDirectory, `${partition.id}-full.json`),
        JSON.stringify(partition.fullCards, null, 2),
        "utf8",
      );
    }

    const files = (await readdir(outputDirectory)).filter((file) => file.endsWith(".json")).sort();
    expect(files).toEqual([
      "partition-a-blind.json",
      "partition-a-full.json",
      "partition-a-hints.json",
      "partition-b-blind.json",
      "partition-b-full.json",
      "partition-b-hints.json",
      "partition-c-blind.json",
      "partition-c-full.json",
      "partition-c-hints.json",
    ]);
  });
});

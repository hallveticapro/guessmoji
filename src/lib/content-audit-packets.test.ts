import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { categories } from "@/data/categories";
import { puzzles } from "@/data/puzzles";
import { buildContentAuditPartitions } from "@/lib/content-audit-packets";

describe("content audit packet builder", () => {
  it("partitions every source card into balanced answer-hidden and full views", () => {
    const partitions = buildContentAuditPartitions(categories, puzzles, 3);
    const blindCards = partitions.flatMap((partition) => partition.blindCards);
    const fullCards = partitions.flatMap((partition) => partition.fullCards);
    const sourceCategoryIds = categories
      .filter((category) => category.id !== "random-mix")
      .map((category) => category.id);

    expect(partitions).toHaveLength(3);
    expect(blindCards).toHaveLength(600);
    expect(fullCards).toHaveLength(600);
    expect(new Set(fullCards.map((card) => card.opaqueId)).size).toBe(600);
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
    expect(
      Math.max(...partitions.map((partition) => partition.fullCards.length)) -
        Math.min(...partitions.map((partition) => partition.fullCards.length)),
    ).toBeLessThanOrEqual(10);
    expect(fullCards.every((card) => /^audit-card-\d+$/.test(card.opaqueId))).toBe(true);
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

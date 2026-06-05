import { categories } from "@/data/categories";
import { puzzles } from "@/data/puzzles";
import type { Category, Puzzle } from "@/types/puzzle";

const RANDOM_MIX_CATEGORY_ID = "random-mix";
const DEFAULT_RANDOM_MIX_COUNT = 20;

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getPuzzlesByCategoryId(categoryId: string): Puzzle[] {
  if (!categoryId || categoryId === RANDOM_MIX_CATEGORY_ID) {
    return [];
  }

  return puzzles.filter((puzzle) => puzzle.categoryId === categoryId);
}

export function getPuzzleById(id: string): Puzzle | undefined {
  return puzzles.find((puzzle) => puzzle.id === id);
}

export function getRandomizedPuzzles(puzzleList: readonly Puzzle[]): Puzzle[] {
  const shuffled = [...puzzleList];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function getRandomMix(count = DEFAULT_RANDOM_MIX_COUNT): Puzzle[] {
  const safeCount = Math.max(0, count);
  const uniquePuzzlePool = uniquePuzzlesById(
    puzzles.filter((puzzle) => puzzle.categoryId !== RANDOM_MIX_CATEGORY_ID),
  );

  return getRandomizedPuzzles(uniquePuzzlePool).slice(0, safeCount);
}

function uniquePuzzlesById(puzzleList: readonly Puzzle[]): Puzzle[] {
  return [...new Map(puzzleList.map((puzzle) => [puzzle.id, puzzle])).values()];
}

import type { Metadata } from "next";
import Link from "next/link";
import { LastCategoryLink } from "@/components/categories/LastCategoryLink";
import {
  getAllCategories,
  getPuzzlesByCategoryId,
  RANDOM_MIX_SESSION_COUNT,
} from "@/lib/puzzles";
import { getCategoryThemeStyle } from "@/lib/category-theme";
import type { Category, PuzzleDifficulty } from "@/types/puzzle";

const difficultyLabels: Record<PuzzleDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const metadata: Metadata = {
  title: "Categories",
  description: "Choose a Guessmoji category for an emoji guessing game.",
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <section className="flex flex-1 flex-col bg-slate-50 px-5 py-10 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-sky-700">
            Choose a category
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal text-slate-950 sm:text-5xl">
            Emoji puzzles ready to play
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-700">
            Pick a theme, start the game, and reveal answers only when everyone is
            ready.
          </p>
        </div>

        <LastCategoryLink categories={categories} />

        <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const puzzleCount = getCategoryPuzzleCount(category);
            const difficultyLabel = getCategoryDifficultyLabel(category);

            return (
              <Link
                key={category.id}
                href={`/play/${category.slug}`}
                className="group flex min-h-72 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="grid size-16 place-items-center rounded-2xl border-2 text-4xl"
                    style={getCategoryThemeStyle(category)}
                    aria-hidden="true"
                  >
                    {category.icon}
                  </span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-900">
                    {puzzleCount} puzzles
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-black text-slate-950">
                  {category.name}
                </h2>
                <p className="mt-3 flex-1 text-base leading-7 text-slate-600">
                  {category.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-800">
                    {difficultyLabel}
                  </span>
                  {category.recommendedGradeBand && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                      Grades {category.recommendedGradeBand}
                    </span>
                  )}
                </div>

                <p className="mt-6 text-base font-black text-sky-700 transition group-hover:text-sky-900">
                  Start category
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function getCategoryPuzzleCount(category: Category) {
  if (category.id === "random-mix") {
    return RANDOM_MIX_SESSION_COUNT;
  }

  return getPuzzlesByCategoryId(category.id).length;
}

function getCategoryDifficultyLabel(category: Category) {
  if (category.id === "random-mix") {
    return "Mixed";
  }

  const difficulties = new Set(
    getPuzzlesByCategoryId(category.id).map((puzzle) => puzzle.difficulty),
  );

  if (difficulties.size === 1) {
    const [difficulty] = difficulties;
    return difficulty ? difficultyLabels[difficulty] : "Mixed";
  }

  if (difficulties.has("hard")) {
    return "Easy to Hard";
  }

  if (difficulties.has("medium")) {
    return "Easy to Medium";
  }

  return "Mixed";
}

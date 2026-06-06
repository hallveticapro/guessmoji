import type { Metadata } from "next";
import Link from "next/link";
import { GameBoard } from "@/components/game/GameBoard";
import {
  getAllCategories,
  getCategoryBySlug,
  getPuzzlesByCategoryId,
  getRandomMix,
  getRandomizedPuzzles,
} from "@/lib/puzzles";
import type { Category, Puzzle } from "@/types/puzzle";

type PlayPageProps = {
  params: Promise<{
    categorySlug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  return {
    title: category ? `Play ${category.name}` : "Category Not Found",
    description: category
      ? `Play the ${category.name} Guessmoji category.`
      : "Choose a valid Guessmoji category.",
  };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return <MissingCategory slug={categorySlug} />;
  }

  const puzzles = getPlayablePuzzles(category);

  if (puzzles.length === 0) {
    return <EmptyCategory category={category} />;
  }

  return (
    <GameBoard
      category={category}
      categories={getAllCategories()}
      initialPuzzles={puzzles}
    />
  );
}

function getPlayablePuzzles(category: Category): Puzzle[] {
  if (category.id === "random-mix") {
    return getRandomMix(20);
  }

  return getRandomizedPuzzles(getPuzzlesByCategoryId(category.id));
}

function MissingCategory({ slug }: { slug: string }) {
  return (
    <section className="flex flex-1 items-center bg-slate-50 px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-normal text-sky-700">
          Category not found
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal text-slate-950 sm:text-5xl">
          No puzzle pack named {slug}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-700">
          Choose one of the available categories and start a fresh game.
        </p>
        <Link
          href="/categories"
          className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-sky-700 px-7 py-3 text-lg font-black text-white transition hover:bg-sky-800 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
        >
          Back to Categories
        </Link>
      </div>
    </section>
  );
}

function EmptyCategory({ category }: { category: Category }) {
  return (
    <section className="flex flex-1 items-center bg-slate-50 px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-normal text-sky-700">
          Empty category
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal text-slate-950 sm:text-5xl">
          {category.name} has no puzzles yet
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-700">
          Pick another category while this pack is being prepared.
        </p>
        <Link
          href="/categories"
          className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-sky-700 px-7 py-3 text-lg font-black text-white transition hover:bg-sky-800 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
        >
          Back to Categories
        </Link>
      </div>
    </section>
  );
}

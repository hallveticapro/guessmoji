"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Category } from "@/types/puzzle";

const LAST_CATEGORY_SLUG_KEY = "guessmoji:lastCategorySlug";

type LastCategoryLinkProps = {
  categories: Category[];
};

export function LastCategoryLink({ categories }: LastCategoryLinkProps) {
  const [lastCategory, setLastCategory] = useState<Category | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const savedSlug = window.localStorage.getItem(LAST_CATEGORY_SLUG_KEY);
        const matchingCategory =
          categories.find((category) => category.slug === savedSlug) ?? null;

        setLastCategory(matchingCategory);

        if (savedSlug && !matchingCategory) {
          window.localStorage.removeItem(LAST_CATEGORY_SLUG_KEY);
        }
      } catch {
        setLastCategory(null);
      }
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [categories]);

  if (!lastCategory) {
    return null;
  }

  return (
    <div className="mt-8 flex flex-col gap-4 border-l-4 border-amber-400 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-normal text-amber-700">
          Last played
        </p>
        <p className="mt-1 text-xl font-black text-slate-950">
          {lastCategory.name}
        </p>
      </div>
      <Link
        href={`/play/${lastCategory.slug}`}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-base font-black text-slate-950 transition hover:bg-amber-200 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
      >
        Continue Category
      </Link>
    </div>
  );
}

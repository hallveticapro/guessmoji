"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import type { Category } from "@/types/puzzle";

const LAST_CATEGORY_SLUG_KEY = "guessmoji:lastCategorySlug";
const LAST_CATEGORY_NAME_KEY = "guessmoji:lastCategoryName";

type LastCategoryLinkProps = {
  categories: Category[];
};

export function LastCategoryLink({ categories }: LastCategoryLinkProps) {
  const lastCategorySnapshot = useSyncExternalStore(
    subscribeToStorage,
    getLastCategorySnapshot,
    getServerSnapshot,
  );

  const lastCategory = useMemo(() => {
    if (!lastCategorySnapshot) {
      return null;
    }

    try {
      const { savedName, savedSlug } = JSON.parse(lastCategorySnapshot) as {
        savedName: string | null;
        savedSlug: string | null;
      };
      const matchingCategory = categories.find((category) => category.slug === savedSlug);

      if (matchingCategory) {
        return matchingCategory;
      }

      if (savedSlug && savedName) {
        return {
          id: savedSlug,
          name: savedName,
          slug: savedSlug,
          description: "Continue the last classroom game.",
        } satisfies Category;
      }
    } catch {
      return null;
    }

    return null;
  }, [categories, lastCategorySnapshot]);

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

function subscribeToStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
  };
}

function getLastCategorySnapshot() {
  try {
    return JSON.stringify({
      savedSlug: window.localStorage.getItem(LAST_CATEGORY_SLUG_KEY),
      savedName: window.localStorage.getItem(LAST_CATEGORY_NAME_KEY),
    });
  } catch {
    return "";
  }
}

function getServerSnapshot() {
  return "";
}

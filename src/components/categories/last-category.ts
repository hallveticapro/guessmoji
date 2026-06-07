import type { Category } from "@/types/puzzle";

export const LAST_CATEGORY_SLUG_KEY = "guessmoji:lastCategorySlug";

type LastCategoryResolution = {
  category: Category | null;
  shouldClearSavedSlug: boolean;
};

export function resolveLastCategory(
  categories: readonly Category[],
  savedSlug: string | null,
): LastCategoryResolution {
  if (!savedSlug) {
    return {
      category: null,
      shouldClearSavedSlug: false,
    };
  }

  const category =
    categories.find((candidate) => candidate.slug === savedSlug) ?? null;

  return {
    category,
    shouldClearSavedSlug: category === null,
  };
}

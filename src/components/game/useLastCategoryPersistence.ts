import { useEffect } from "react";
import type { Category } from "@/types/puzzle";

const LAST_CATEGORY_SLUG_KEY = "guessmoji:lastCategorySlug";
const LAST_CATEGORY_NAME_KEY = "guessmoji:lastCategoryName";

export function useLastCategoryPersistence(category: Category, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    saveLocalPreference(LAST_CATEGORY_SLUG_KEY, category.slug);
    saveLocalPreference(LAST_CATEGORY_NAME_KEY, category.name);
  }, [category.name, category.slug, enabled]);
}

function saveLocalPreference(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Local storage can be unavailable in locked-down browsers.
  }
}

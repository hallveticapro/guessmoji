export const ROUND_HISTORY_STORAGE_KEY = "guessmoji:round-history:v1";

type RoundHistoryDocument = {
  version: 1;
  categories: Record<string, string[]>;
};

export function readCategoryRoundHistory(
  storage: Pick<Storage, "getItem"> | undefined,
  categoryId: string,
): string[] {
  try {
    const document = readDocument(storage);
    if (!document) {
      return [];
    }

    const categoryHistory = document.categories[categoryId];
    return Array.isArray(categoryHistory) ? [...categoryHistory] : [];
  } catch {
    return [];
  }
}

export function writeCategoryRoundHistory(
  storage: Pick<Storage, "getItem" | "setItem"> | undefined,
  categoryId: string,
  seenIds: readonly string[],
): void {
  if (!storage) {
    return;
  }

  try {
    const existingDocument = readDocument(storage);
    const categories = existingDocument?.categories ?? {};
    const document: RoundHistoryDocument = {
      version: 1,
      categories: {
        ...categories,
        [categoryId]: [...seenIds],
      },
    };

    storage.setItem(ROUND_HISTORY_STORAGE_KEY, JSON.stringify(document));
  } catch {
    // Browser storage can be unavailable, full, or blocked by privacy settings.
  }
}

function readDocument(
  storage: Pick<Storage, "getItem"> | undefined,
): RoundHistoryDocument | undefined {
  try {
    if (!storage) {
      return undefined;
    }

    const rawDocument = storage.getItem(ROUND_HISTORY_STORAGE_KEY);
    if (!rawDocument) {
      return undefined;
    }

    const parsed: unknown = JSON.parse(rawDocument);
    if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.categories)) {
      return undefined;
    }

    const categories: Record<string, string[]> = {};
    for (const [categoryId, categoryHistory] of Object.entries(parsed.categories)) {
      if (!Array.isArray(categoryHistory) || !categoryHistory.every(isString)) {
        return undefined;
      }

      categories[categoryId] = [...categoryHistory];
    }

    return { version: 1, categories };
  } catch {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

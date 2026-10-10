"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CustomPack } from "@/types/custom-pack";
import {
  CUSTOM_PACKS_STORAGE_KEY,
  MAX_PACKS,
  createEmptyPack,
  importPack as parseImport,
  readPackLibrary,
  serializePackLibrary,
} from "@/lib/custom-packs";

type SaveState = "saved" | "unsaved" | "unavailable" | "conflict";
type LibraryState = {
  packs: CustomPack[];
  ready: boolean;
  saveState: SaveState;
  error: string | null;
};
const initial: LibraryState = {
  packs: [],
  ready: false,
  saveState: "saved",
  error: null,
};
// This tab's draft survives App Router history navigation even when browser
// storage cannot accept it. It is never shared with the server or other tabs.
let pendingSession: {
  state: LibraryState;
  expectedRaw: string | null | undefined;
  blocked: boolean;
} | null = null;

function guardPendingDraft(event: BeforeUnloadEvent) {
  if (!pendingSession) return;
  event.preventDefault();
  event.returnValue = "";
}

function cachePendingDraft(next: typeof pendingSession) {
  if (typeof window === "undefined") return;
  if (!pendingSession && next)
    window.addEventListener("beforeunload", guardPendingDraft);
  else if (pendingSession && !next)
    window.removeEventListener("beforeunload", guardPendingDraft);
  pendingSession = next;
}

const message = (error: unknown) =>
  error instanceof Error ? error.message : "Browser storage is unavailable.";

export function useCustomPacks() {
  const [state, setState] = useState<LibraryState>(initial);
  const current = useRef(state);
  const expectedRaw = useRef<string | null | undefined>(undefined);
  const dirty = useRef(false);
  const blocked = useRef(false);

  const publish = useCallback((next: LibraryState) => {
    current.current = next;
    cachePendingDraft(
      dirty.current
        ? {
            state: next,
            expectedRaw: expectedRaw.current,
            blocked: blocked.current,
          }
        : null,
    );
    setState(next);
  }, []);

  const reload = useCallback(() => {
    try {
      const raw = window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY);
      const packs = readPackLibrary(raw);
      expectedRaw.current = raw;
      blocked.current = false;
      dirty.current = false;
      publish({ packs, ready: true, saveState: "saved", error: null });
    } catch (error) {
      blocked.current = true;
      publish({
        ...current.current,
        ready: true,
        saveState: "unavailable",
        error: `Could not load your library: ${message(error)} Your existing browser data has been preserved.`,
      });
    }
  }, [publish]);

  const persist = useCallback(
    (packs: CustomPack[]) => {
      try {
        if (blocked.current || expectedRaw.current === undefined) {
          publish({
            ...current.current,
            packs,
            saveState: "unavailable",
            error:
              "Saving is unavailable until the existing library can be loaded. Export your drafts to keep a copy.",
          });
          return;
        }
        const raw = window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY);
        if (raw !== expectedRaw.current) {
          publish({
            ...current.current,
            packs,
            saveState: "conflict",
            error:
              "Your library changed in another tab. Export your drafts before reloading the saved library.",
          });
          return;
        }
        const serialized = serializePackLibrary(packs);
        window.localStorage.setItem(CUSTOM_PACKS_STORAGE_KEY, serialized);
        expectedRaw.current = serialized;
        dirty.current = false;
        publish({ packs, ready: true, saveState: "saved", error: null });
      } catch (error) {
        publish({
          ...current.current,
          packs,
          saveState: "unsaved",
          error: `Your changes are in this tab but could not be saved: ${message(error)} Export a copy or retry saving.`,
        });
      }
    },
    [publish],
  );

  const edit = useCallback(
    (packs: CustomPack[]) => {
      // Validate before accepting an edit; never retain a structure that cannot be exported.
      const safePacks = readPackLibrary(serializePackLibrary(packs));
      dirty.current = true;
      publish({ ...current.current, packs: safePacks });
      persist(safePacks);
    },
    [persist, publish],
  );

  useEffect(() => {
    // Defer hydration so the first client render matches the server render.
    const timer = window.setTimeout(() => {
      if (pendingSession) {
        expectedRaw.current = pendingSession.expectedRaw;
        blocked.current = pendingSession.blocked;
        dirty.current = true;
        publish(pendingSession.state);
      } else reload();
    }, 0);
    const onStorage = (event: StorageEvent) => {
      // Hydration will read the latest saved data or restore this tab's draft.
      // An event before then must not replace a pending session.
      if (!current.current.ready) return;
      if (event.key !== CUSTOM_PACKS_STORAGE_KEY && event.key !== null) return;
      if (event.storageArea && event.storageArea !== window.localStorage)
        return;
      if (dirty.current) {
        if (event.newValue !== expectedRaw.current || event.key === null) {
          publish({
            ...current.current,
            saveState: "conflict",
            error:
              "Your library changed in another tab. Your unsaved drafts are still here; export them before reloading.",
          });
        }
      } else reload();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", onStorage);
    };
  }, [publish, reload]);

  const createPack = useCallback((): CustomPack | null => {
    if (!current.current.ready) return null;
    if (current.current.packs.length >= MAX_PACKS) {
      publish({
        ...current.current,
        error: `Your library is full. You can keep up to ${MAX_PACKS} packs.`,
      });
      return null;
    }
    const pack = createEmptyPack();
    edit([...current.current.packs, pack]);
    return pack;
  }, [edit, publish]);

  const updatePack = useCallback(
    (pack: CustomPack) => {
      if (
        !current.current.ready ||
        !current.current.packs.some((saved) => saved.id === pack.id)
      )
        return;
      edit(
        current.current.packs.map((saved) =>
          saved.id === pack.id
            ? { ...pack, createdAt: saved.createdAt, updatedAt: Date.now() }
            : saved,
        ),
      );
    },
    [edit],
  );

  const deletePack = useCallback(
    (id: string) => {
      if (
        !current.current.ready ||
        !current.current.packs.some((pack) => pack.id === id)
      )
        return;
      edit(current.current.packs.filter((pack) => pack.id !== id));
    },
    [edit],
  );

  const importPack = useCallback(
    (text: string): CustomPack => {
      if (!current.current.ready)
        throw new Error(
          "Wait for your library to load before importing a pack.",
        );
      if (current.current.packs.length >= MAX_PACKS)
        throw new Error(
          `Your library is full. You can keep up to ${MAX_PACKS} packs.`,
        );
      const pack = parseImport(text);
      edit([...current.current.packs, pack]);
      return pack;
    },
    [edit],
  );

  const retrySave = useCallback(() => {
    if (!dirty.current) {
      reload();
      return;
    }
    if (blocked.current || expectedRaw.current === undefined) {
      try {
        const raw = window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY);
        readPackLibrary(raw);
        if (raw !== null) {
          publish({
            ...current.current,
            saveState: "conflict",
            error:
              "A saved library already exists. Export your drafts before reloading it.",
          });
          return;
        }
        // With no existing data, retrying cannot overwrite another library.
        expectedRaw.current = null;
        blocked.current = false;
      } catch (error) {
        publish({
          ...current.current,
          saveState: "unavailable",
          error: `Saving is still unavailable: ${message(error)} Your drafts and existing browser data have been preserved.`,
        });
        return;
      }
    }
    persist(current.current.packs);
  }, [persist, publish, reload]);

  return {
    ...state,
    createPack,
    updatePack,
    deletePack,
    importPack,
    reload,
    retrySave,
  };
}

// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCustomPacks } from "./useCustomPacks";
import {
  CUSTOM_PACKS_STORAGE_KEY,
  createEmptyPack,
  exportPack,
  MAX_PACKS,
  readPackLibrary,
  serializePackLibrary,
} from "@/lib/custom-packs";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("custom library persistence", () => {
  let library: ReturnType<typeof useCustomPacks>;
  let container: HTMLDivElement;
  let root: Root;
  function Harness() {
    library = useCustomPacks();
    return <div>{library.packs.map((pack) => pack.name).join("|")}</div>;
  }
  function mount() {
    act(() => root.render(<Harness />));
    act(() => vi.runAllTimers());
  }
  function createNamed(name: string) {
    let pack = createEmptyPack();
    act(() => {
      pack = library.createPack()!;
    });
    act(() => library.updatePack({ ...pack, name }));
    return pack.id;
  }
  function savedNames() {
    return readPackLibrary(
      window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY),
    ).map((pack) => pack.name);
  }
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    // Deliberately reload successfully to discard this test's in-memory draft.
    act(() => library.reload());
    act(() => root.unmount());
    container.remove();
    vi.useRealTimers();
  });

  it("saves consecutive edits across pack switches synchronously", () => {
    mount();
    const first = createNamed("First");
    createNamed("Second");
    act(() =>
      library.updatePack({
        ...library.packs.find((pack) => pack.id === first)!,
        description: "Changed after switching",
      }),
    );
    expect(savedNames()).toEqual(["First", "Second"]);
    expect(
      readPackLibrary(window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY))[0]
        .description,
    ).toBe("Changed after switching");
    expect(library.saveState).toBe("saved");
    act(() => root.unmount());
    root = createRoot(container);
    mount();
    expect(library.packs.map((pack) => pack.name)).toEqual(["First", "Second"]);
  });

  it("retains a quota-failed draft, blocks unload, and retries saving", () => {
    mount();
    const write = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("Quota full", "QuotaExceededError");
      });
    createNamed("Keep me");
    expect(library.saveState).toBe("unsaved");
    expect(library.packs[0].name).toBe("Keep me");
    expect(window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY)).toBeNull();
    const unload = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(unload);
    expect(unload.defaultPrevented).toBe(true);
    write.mockRestore();
    act(() => library.retrySave());
    expect(library.saveState).toBe("saved");
    expect(savedNames()).toEqual(["Keep me"]);
    const cleanUnload = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(cleanUnload);
    expect(cleanUnload.defaultPrevented).toBe(false);
  });

  it("keeps a failed-write draft across route unmount and remount, then retries", () => {
    mount();
    const write = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("Storage full");
      });
    const id = createNamed("History draft");
    act(() => root.unmount());
    const awayUnload = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(awayUnload);
    expect(awayUnload.defaultPrevented).toBe(true);
    root = createRoot(container);
    mount();
    expect(library.packs[0]).toMatchObject({ id, name: "History draft" });
    expect(library.saveState).toBe("unsaved");
    const unload = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(unload);
    expect(unload.defaultPrevented).toBe(true);
    write.mockRestore();
    act(() => library.retrySave());
    expect(library.saveState).toBe("saved");
    expect(savedNames()).toEqual(["History draft"]);
    const savedUnload = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(savedUnload);
    expect(savedUnload.defaultPrevented).toBe(false);
  });

  it("explicit successful reload discards the cached draft across remounts", () => {
    mount();
    const id = createNamed("Saved original");
    const write = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("Storage full");
      });
    act(() =>
      library.updatePack({ ...library.packs[0], name: "Discard this edit" }),
    );
    expect(library.saveState).toBe("unsaved");
    write.mockRestore();
    act(() => library.reload());
    expect(library.packs[0]).toMatchObject({ id, name: "Saved original" });
    expect(library.saveState).toBe("saved");
    act(() => root.unmount());
    root = createRoot(container);
    mount();
    expect(library.packs[0].name).toBe("Saved original");
    expect(library.saveState).toBe("saved");
  });

  it("keeps the original snapshot baseline when another tab changes storage while away", () => {
    mount();
    createNamed("Original");
    const write = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("Storage full");
      });
    act(() => library.updatePack({ ...library.packs[0], name: "Local draft" }));
    act(() => root.unmount());
    write.mockRestore();
    const remote = serializePackLibrary([
      { ...createEmptyPack(), name: "Remote while away" },
    ]);
    window.localStorage.setItem(CUSTOM_PACKS_STORAGE_KEY, remote);
    root = createRoot(container);
    mount();
    expect(library.packs[0].name).toBe("Local draft");
    act(() => library.retrySave());
    expect(library.saveState).toBe("conflict");
    expect(window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY)).toBe(remote);
  });

  it("keeps cached drafts when a storage event arrives before remount hydration", () => {
    mount();
    const write = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("Storage full");
      });
    createNamed("Pending hydration draft");
    act(() => root.unmount());
    write.mockRestore();
    const remote = serializePackLibrary([
      { ...createEmptyPack(), name: "Remote event" },
    ]);
    window.localStorage.setItem(CUSTOM_PACKS_STORAGE_KEY, remote);
    root = createRoot(container);
    act(() => root.render(<Harness />));
    expect(library.ready).toBe(false);
    act(() =>
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: CUSTOM_PACKS_STORAGE_KEY,
          newValue: remote,
        }),
      ),
    );
    act(() => vi.runAllTimers());
    expect(library.packs[0].name).toBe("Pending hydration draft");
    expect(library.saveState).toBe("unsaved");
    act(() => library.retrySave());
    expect(library.saveState).toBe("conflict");
    expect(window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY)).toBe(remote);
  });

  it("reads latest storage on cold hydration after an early storage event", () => {
    act(() => root.render(<Harness />));
    const latest = serializePackLibrary([
      { ...createEmptyPack(), name: "Latest before hydration" },
    ]);
    window.localStorage.setItem(CUSTOM_PACKS_STORAGE_KEY, latest);
    act(() =>
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: CUSTOM_PACKS_STORAGE_KEY,
          newValue: latest,
        }),
      ),
    );
    expect(library.ready).toBe(false);
    act(() => vi.runAllTimers());
    expect(library.packs[0].name).toBe("Latest before hydration");
    expect(library.saveState).toBe("saved");
  });

  it("retains blocked corrupt-storage drafts across route remounts", () => {
    const corrupt = '{"version":999,"packs":[]}';
    window.localStorage.setItem(CUSTOM_PACKS_STORAGE_KEY, corrupt);
    mount();
    createNamed("Blocked draft");
    act(() => root.unmount());
    root = createRoot(container);
    mount();
    expect(library.packs[0].name).toBe("Blocked draft");
    expect(library.saveState).toBe("unavailable");
    act(() => library.retrySave());
    expect(window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY)).toBe(corrupt);
  });

  it("checks the expected snapshot before writing and retains conflicting drafts", () => {
    mount();
    const id = createNamed("Local");
    const remote = { ...createEmptyPack(), name: "Remote" };
    const remoteRaw = serializePackLibrary([remote]);
    window.localStorage.setItem(CUSTOM_PACKS_STORAGE_KEY, remoteRaw);
    act(() =>
      library.updatePack({
        ...library.packs.find((pack) => pack.id === id)!,
        name: "Unsaved local",
      }),
    );
    expect(library.saveState).toBe("conflict");
    expect(library.packs[0].name).toBe("Unsaved local");
    expect(window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY)).toBe(
      remoteRaw,
    );
    act(() => library.retrySave());
    expect(library.saveState).toBe("conflict");
    act(() => library.reload());
    expect(library.packs[0].name).toBe("Remote");
    expect(library.saveState).toBe("saved");
  });

  it("refreshes clean tabs from storage events and keeps unsaved tabs intact", () => {
    mount();
    const remote = serializePackLibrary([
      { ...createEmptyPack(), name: "Other tab" },
    ]);
    window.localStorage.setItem(CUSTOM_PACKS_STORAGE_KEY, remote);
    act(() =>
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: CUSTOM_PACKS_STORAGE_KEY,
          newValue: remote,
        }),
      ),
    );
    expect(library.packs[0].name).toBe("Other tab");
    const write = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("No space");
      });
    act(() => library.updatePack({ ...library.packs[0], name: "My draft" }));
    write.mockRestore();
    const changed = serializePackLibrary([
      { ...createEmptyPack(), name: "New remote" },
    ]);
    window.localStorage.setItem(CUSTOM_PACKS_STORAGE_KEY, changed);
    act(() =>
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: CUSTOM_PACKS_STORAGE_KEY,
          newValue: changed,
        }),
      ),
    );
    expect(library.packs[0].name).toBe("My draft");
    expect(library.saveState).toBe("conflict");
  });

  it.each(["corrupt JSON", '{"version":99,"packs":[]}'])(
    "never overwrites invalid library %s",
    (raw) => {
      window.localStorage.setItem(CUSTOM_PACKS_STORAGE_KEY, raw);
      mount();
      expect(library.ready).toBe(true);
      expect(library.saveState).toBe("unavailable");
      createNamed("Recovery draft");
      expect(library.packs[0].name).toBe("Recovery draft");
      expect(importedName(exportPack(library.packs[0]))).toBe("Recovery draft");
      act(() => library.retrySave());
      expect(window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY)).toBe(raw);
    },
  );

  it("keeps an editable draft when reading storage is denied", () => {
    const read = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("Access denied");
      });
    mount();
    createNamed("Offline draft");
    expect(library.saveState).toBe("unavailable");
    expect(library.packs[0].name).toBe("Offline draft");
    read.mockRestore();
    act(() => library.retrySave());
    expect(library.saveState).toBe("saved");
    expect(savedNames()).toEqual(["Offline draft"]);
  });

  it("preserves an existing library when storage access recovers", () => {
    const existing = serializePackLibrary([
      { ...createEmptyPack(), name: "Existing" },
    ]);
    window.localStorage.setItem(CUSTOM_PACKS_STORAGE_KEY, existing);
    const read = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("Access denied");
      });
    mount();
    createNamed("Offline draft");
    read.mockRestore();
    act(() => library.retrySave());
    expect(library.saveState).toBe("conflict");
    expect(library.packs[0].name).toBe("Offline draft");
    expect(window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY)).toBe(
      existing,
    );
  });

  it("rejects malformed imports and full libraries without changing saved packs", () => {
    const full = Array.from({ length: MAX_PACKS }, () => createEmptyPack());
    window.localStorage.setItem(
      CUSTOM_PACKS_STORAGE_KEY,
      serializePackLibrary(full),
    );
    mount();
    expect(() => library.importPack(exportPack(createEmptyPack()))).toThrow(
      /full/,
    );
    act(() => {
      expect(library.createPack()).toBeNull();
    });
    expect(library.packs).toHaveLength(MAX_PACKS);
    act(() => library.deletePack(full[0].id));
    const before = window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY);
    expect(() => library.importPack("bad JSON")).toThrow();
    expect(window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY)).toBe(before);
    act(() => {
      library.importPack(
        exportPack({ ...createEmptyPack(), name: "Imported" }),
      );
    });
    expect(savedNames()).toContain("Imported");
  });
});

function importedName(text: string) {
  return JSON.parse(text).pack.name;
}

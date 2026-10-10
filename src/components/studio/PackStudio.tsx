"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_IMPORT_BYTES, MAX_PACKS } from "@/lib/custom-packs";
import { useCustomPacks } from "./useCustomPacks";
import { PackEditor, downloadPack } from "./PackEditor";
import { primaryButtonClass, quietButtonClass } from "./styles";

export function PackStudio() {
  const library = useCustomPacks();
  // The library hydrates later, so reading the return selection here does not
  // change the server/client loading markup or repeatedly override user choice.
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("pack"),
  );
  const [importError, setImportError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pack =
    library.packs.find((item) => item.id === selectedId) ?? library.packs[0];
  const atLimit = library.packs.length >= MAX_PACKS;

  useEffect(() => {
    if (library.saveState === "saved") return;
    function protectNavigation(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (
        !(anchor instanceof HTMLAnchorElement) ||
        anchor.hasAttribute("download")
      )
        return;
      const url = new URL(anchor.href, window.location.href);
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      )
        return;
      if (
        !window.confirm(
          "Your changes are not saved in this browser. Export a backup before leaving if you want to keep them. Leave the studio?",
        )
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
    document.addEventListener("click", protectNavigation, true);
    return () => document.removeEventListener("click", protectNavigation, true);
  }, [library.saveState]);

  function createPack() {
    const created = library.createPack();
    if (created) {
      setSelectedId(created.id);
      setNotice("New pack created. Start by giving it a name.");
      setImportError(null);
    }
  }

  async function readImport(file: File | undefined) {
    if (!file) return;
    setImportError(null);
    setNotice(null);
    setImporting(true);
    try {
      if (file.size > MAX_IMPORT_BYTES)
        throw new Error("Choose a pack file smaller than 1 MB.");
      const imported = library.importPack(await file.text());
      setSelectedId(imported.id);
      setNotice(
        "Pack imported as a new copy. Your existing packs are unchanged.",
      );
    } catch (error) {
      setImportError(
        error instanceof Error
          ? error.message
          : "This file could not be read. Please try another pack backup.",
      );
    } finally {
      setImporting(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <section className="flex-1 bg-[#fff9ed] px-4 py-8 text-[#17324d] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-7 max-w-3xl">
          <h1 className="text-3xl font-black sm:text-4xl">
            Custom Pack Studio
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-7 text-[#435762]">
            Turn your lesson, family theme, or inside joke into a game. Create
            your clues, preview each reveal, then bring everyone together to
            play.
          </p>
        </div>
        {!library.ready ? (
          <div
            role="status"
            className="rounded-2xl border-2 border-[#d5e4df] bg-white p-8"
          >
            <p className="font-bold">Opening your pack library…</p>
          </div>
        ) : (
          <>
            <div className="mb-5 rounded-xl border-2 border-[#d5e4df] bg-white p-4">
              <p role="status" className="text-sm font-bold">
                {library.saveState === "saved"
                  ? "Saved in this browser"
                  : library.saveState === "conflict"
                    ? "Another tab changed your library"
                    : library.saveState === "unavailable"
                      ? "Browser saving is unavailable"
                      : "Changes are not saved yet"}
              </p>
              {library.saveState !== "saved" && (
                <div className="mt-2 text-sm leading-6 text-[#435762]">
                  <p>
                    {library.error ||
                      "Your work is still here. Keep a backup while saving is unavailable."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className={quietButtonClass}
                      disabled={library.packs.length === 0}
                      onClick={() => {
                        try {
                          library.packs.forEach(downloadPack);
                          setNotice(
                            "Backup downloads started for all packs. Allow multiple downloads if your browser asks.",
                          );
                        } catch {
                          setImportError(
                            "Backups could not be downloaded. Please try again.",
                          );
                        }
                      }}
                    >
                      Back up all packs
                    </button>
                    {library.saveState !== "conflict" && (
                      <button
                        type="button"
                        className={quietButtonClass}
                        onClick={library.retrySave}
                      >
                        Retry saving
                      </button>
                    )}
                    <button
                      type="button"
                      className={quietButtonClass}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Reload the saved library? Any changes that have not been saved will be lost. Export a backup first to keep them.",
                          )
                        )
                          library.reload();
                      }}
                    >
                      Reload saved library
                    </button>
                  </div>
                </div>
              )}
            </div>
            {notice && (
              <p
                role="status"
                className="mb-5 rounded-xl bg-[#e1f5ef] px-4 py-3 text-sm leading-6"
              >
                {notice}
              </p>
            )}
            {importError && (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-800 [overflow-wrap:anywhere]"
              >
                {importError}
              </p>
            )}
            <div className="grid items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
              <aside
                aria-labelledby="library-title"
                className="min-w-0 rounded-2xl border-2 border-[#d5e4df] bg-[#eaf7f1] p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 id="library-title" className="text-xl font-black">
                    Your library
                  </h2>
                  <span className="text-sm text-[#435762]">
                    {library.packs.length} / {MAX_PACKS}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-1">
                  <button
                    type="button"
                    className={primaryButtonClass}
                    disabled={atLimit}
                    onClick={createPack}
                  >
                    New pack
                  </button>
                  <button
                    type="button"
                    className={quietButtonClass}
                    disabled={atLimit || importing}
                    onClick={() => inputRef.current?.click()}
                  >
                    {importing ? "Importing…" : "Import pack"}
                  </button>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  aria-label="Import a Guessmoji pack backup"
                  onChange={(event) => {
                    void readImport(event.target.files?.[0]);
                  }}
                />
                {atLimit && (
                  <p className="mt-3 text-sm leading-6">
                    Your library is full. Export and remove a pack to make room.
                  </p>
                )}
                <p className="mt-4 text-sm leading-6 text-[#435762]">
                  Packs stay on this device and browser. Import a JSON backup to
                  add a shared pack.
                </p>
                {library.packs.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {library.packs.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          aria-pressed={item.id === pack?.id}
                          className={`flex min-h-16 w-full items-center gap-3 rounded-xl border-2 p-3 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#00778d] ${item.id === pack?.id ? "border-[#00778d] bg-white" : "border-transparent hover:border-[#8bc9c3] hover:bg-white/60"}`}
                          onClick={() => setSelectedId(item.id)}
                        >
                          <span
                            className="max-w-12 shrink-0 overflow-hidden text-2xl"
                            aria-hidden="true"
                          >
                            {item.icon.trim() || "🎨"}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-bold [overflow-wrap:anywhere]">
                              {item.name.trim() || "Untitled pack"}
                            </span>
                            <span className="mt-1 block text-sm text-[#435762]">
                              {item.cards.length}{" "}
                              {item.cards.length === 1 ? "card" : "cards"}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </aside>
              {pack ? (
                <PackEditor
                  key={pack.id}
                  pack={pack}
                  saved={library.saveState === "saved"}
                  onChange={library.updatePack}
                  onDelete={() => {
                    library.deletePack(pack.id);
                    setSelectedId(null);
                    setNotice("Pack deleted.");
                  }}
                />
              ) : (
                <div className="rounded-2xl border-2 border-[#d5e4df] bg-white px-5 py-12 text-center sm:px-10">
                  <span className="text-5xl" aria-hidden="true">
                    🎨
                  </span>
                  <h2 className="mt-5 text-2xl font-black">
                    Make a game that’s yours
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg leading-7 text-[#435762]">
                    Choose a theme your group knows. Add emoji clues and
                    answers, then test them with the live preview. You can save
                    unfinished packs and come back later.
                  </p>
                  <button
                    type="button"
                    className={`${primaryButtonClass} mt-6`}
                    onClick={createPack}
                  >
                    Create your first pack
                  </button>
                  <p className="mt-5 text-sm text-[#435762]">
                    Have a pack file? Use Import pack to add it to your library.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

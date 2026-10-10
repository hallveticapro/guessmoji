"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  createEmptyCard,
  exportPack,
  getPackProblems,
  MAX_CARDS,
  MAX_CLUE_EMOJI,
  PACK_LIMITS,
} from "@/lib/custom-packs";
import type { CustomCard, CustomPack } from "@/types/custom-pack";
import { PackPreview } from "./PackPreview";
import { fieldClass, quietButtonClass, primaryButtonClass } from "./styles";

export function downloadPack(pack: CustomPack) {
  const blob = new Blob([exportPack(pack)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${
    pack.name
      .trim()
      .replace(/[^a-z0-9_-]/gi, "-")
      .slice(0, 80) || "guessmoji-pack"
  }.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PackEditor({
  pack,
  saved,
  onChange,
  onDelete,
}: {
  pack: CustomPack;
  saved: boolean;
  onChange: (pack: CustomPack) => void;
  onDelete: () => void;
}) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const answerRef = useRef<HTMLInputElement>(null);
  const card =
    pack.cards.find((item) => item.id === selectedCardId) ?? pack.cards[0];
  const problems = getPackProblems(pack);
  const updateCard = (changes: Partial<CustomCard>) => {
    if (card)
      onChange({
        ...pack,
        cards: pack.cards.map((item) =>
          item.id === card.id ? { ...item, ...changes } : item,
        ),
      });
  };
  const addCard = () => {
    const next = createEmptyCard();
    onChange({ ...pack, cards: [...pack.cards, next] });
    setSelectedCardId(next.id);
    requestAnimationFrame(() => answerRef.current?.focus());
  };

  return (
    <div className="min-w-0 space-y-6">
      <section
        aria-labelledby="pack-title"
        className="rounded-2xl border-2 border-[#d5e4df] bg-white p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 id="pack-title" className="text-2xl font-black">
              Pack details
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#435762]">
              Give your game a theme, then build one clue at a time.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={quietButtonClass}
              onClick={() => {
                try {
                  downloadPack(pack);
                  setExportError(null);
                } catch {
                  setExportError(
                    "Your backup could not be downloaded. Please try again.",
                  );
                }
              }}
            >
              Export backup
            </button>
            {saved && problems.length === 0 ? (
              <Link
                href={`/studio/play?id=${encodeURIComponent(pack.id)}`}
                className={primaryButtonClass}
              >
                Play pack
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className={primaryButtonClass}
                aria-describedby="play-requirements"
              >
                Play pack
              </button>
            )}
          </div>
        </div>
        {exportError && (
          <p role="alert" className="mt-4 text-red-800">
            {exportError}
          </p>
        )}
        <div className="mt-5 grid gap-4 sm:grid-cols-[6rem_minmax(0,1fr)]">
          <label className="text-sm font-bold">
            Pack icon
            <input
              className={`${fieldClass} text-center text-2xl`}
              value={pack.icon}
              maxLength={PACK_LIMITS.icon}
              onChange={(event) =>
                onChange({ ...pack, icon: event.target.value })
              }
              placeholder="🎨"
            />
          </label>
          <label className="text-sm font-bold">
            Pack name <span className="font-normal">(required)</span>
            <input
              className={fieldClass}
              value={pack.name}
              maxLength={PACK_LIMITS.name}
              onChange={(event) =>
                onChange({ ...pack, name: event.target.value })
              }
              placeholder="Name your theme"
            />
          </label>
        </div>
        <label className="mt-4 block text-sm font-bold">
          Description <span className="font-normal">(optional)</span>
          <textarea
            rows={2}
            className={fieldClass}
            value={pack.description}
            maxLength={PACK_LIMITS.description}
            onChange={(event) =>
              onChange({ ...pack, description: event.target.value })
            }
            placeholder="What will players be guessing?"
          />
        </label>
        <div
          id="play-requirements"
          className="mt-4 text-sm leading-6 text-[#435762]"
        >
          {problems.length > 0 ? (
            <>
              <p className="font-bold">Before you play:</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {problems.map((problem) => (
                  <li key={problem}>{problem}</li>
                ))}
              </ul>
            </>
          ) : !saved ? (
            <p>Save this pack in your browser before starting a game.</p>
          ) : (
            <p>
              Ready to play. Your answers stay hidden until you reveal them.
            </p>
          )}
        </div>
      </section>

      <section
        aria-labelledby="cards-title"
        className="rounded-2xl border-2 border-[#d5e4df] bg-white p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="cards-title" className="text-2xl font-black">
            Cards{" "}
            <span className="text-base font-normal text-[#435762]">
              {pack.cards.length} / {MAX_CARDS}
            </span>
          </h2>
          <button
            type="button"
            className={quietButtonClass}
            disabled={pack.cards.length >= MAX_CARDS}
            onClick={addCard}
          >
            Add card
          </button>
        </div>
        {pack.cards.length >= MAX_CARDS && (
          <p className="mt-3 text-sm text-[#435762]">
            This pack has reached the {MAX_CARDS}-card limit.
          </p>
        )}
        {!card ? (
          <div className="py-10 text-center">
            <p className="text-lg font-bold">Start with your first clue</p>
            <p className="mt-2 text-[#435762]">
              Add a card, choose an answer, and describe it with emojis.
            </p>
            <button
              type="button"
              className={`${primaryButtonClass} mt-5`}
              onClick={addCard}
            >
              Add first card
            </button>
          </div>
        ) : (
          <>
            <div
              className="mt-5 flex max-h-52 flex-wrap gap-2 overflow-y-auto p-1"
              aria-label="Choose a card"
            >
              {pack.cards.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === card.id}
                  onClick={() => setSelectedCardId(item.id)}
                  className={`min-h-11 max-w-full rounded-lg border-2 px-3 py-2 text-left text-sm font-bold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#00778d] ${item.id === card.id ? "border-[#00778d] bg-[#e1f5ef]" : "border-[#d5e4df] bg-white hover:bg-[#f3fbf7]"}`}
                >
                  <span className="block max-w-52 truncate">
                    {index + 1}. {item.answer.trim() || "Untitled card"}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-2">
              <div className="min-w-0 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-black">
                    Card{" "}
                    {pack.cards.findIndex((item) => item.id === card.id) + 1}
                  </h3>
                  <button
                    type="button"
                    className="min-h-11 rounded-lg px-3 text-sm font-bold text-red-800 hover:bg-red-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-red-800"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete ${card.answer.trim() ? `“${card.answer}”` : "this card"}? This cannot be undone.`,
                        )
                      ) {
                        onChange({
                          ...pack,
                          cards: pack.cards.filter(
                            (item) => item.id !== card.id,
                          ),
                        });
                        setSelectedCardId(null);
                      }
                    }}
                  >
                    Delete card
                  </button>
                </div>
                <label className="block text-sm font-bold">
                  Answer <span className="font-normal">(required)</span>
                  <input
                    ref={answerRef}
                    className={fieldClass}
                    value={card.answer}
                    maxLength={PACK_LIMITS.answer}
                    onChange={(event) =>
                      updateCard({ answer: event.target.value })
                    }
                    placeholder="What should players guess?"
                  />
                </label>
                <label className="block text-sm font-bold">
                  Emoji clue <span className="font-normal">(required)</span>
                  <input
                    className={`${fieldClass} text-2xl`}
                    value={card.emojis}
                    maxLength={PACK_LIMITS.emojis}
                    onChange={(event) =>
                      updateCard({ emojis: event.target.value })
                    }
                    placeholder="Paste or type your emojis"
                    aria-describedby="clue-help"
                  />
                  <span
                    id="clue-help"
                    className="mt-2 block font-normal leading-5 text-[#435762]"
                  >
                    Use 1–{MAX_CLUE_EMOJI} emoji from your device’s emoji
                    keyboard. Build a clue instead of showing the answer
                    directly.
                  </span>
                </label>
                <label className="block text-sm font-bold">
                  Difficulty
                  <select
                    className={fieldClass}
                    value={card.difficulty}
                    onChange={(event) =>
                      updateCard({
                        difficulty: event.target
                          .value as CustomCard["difficulty"],
                      })
                    }
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </label>
                <label className="block text-sm font-bold">
                  Hint <span className="font-normal">(optional)</span>
                  <textarea
                    className={fieldClass}
                    rows={2}
                    value={card.hint}
                    maxLength={PACK_LIMITS.hint}
                    onChange={(event) =>
                      updateCard({ hint: event.target.value })
                    }
                    placeholder="A nudge that doesn’t give the answer away"
                  />
                </label>
                <label className="block text-sm font-bold">
                  Explanation <span className="font-normal">(optional)</span>
                  <textarea
                    className={fieldClass}
                    rows={3}
                    value={card.explanation}
                    maxLength={PACK_LIMITS.explanation}
                    onChange={(event) =>
                      updateCard({ explanation: event.target.value })
                    }
                    placeholder="Explain how the emojis connect to the answer"
                  />
                  <span className="mt-2 block font-normal text-[#435762]">
                    Shown after the answer is revealed.
                  </span>
                </label>
              </div>
              <div className="min-w-0">
                <PackPreview key={card.id} card={card} packName={pack.name} />
              </div>
            </div>
          </>
        )}
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-sm text-[#435762]">
        <p>Back up your packs to keep a copy outside this browser.</p>
        <button
          type="button"
          className="min-h-11 rounded-lg px-3 font-bold text-red-800 hover:bg-red-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-red-800"
          onClick={() => {
            if (
              window.confirm(
                `Delete “${pack.name.trim() || "Untitled pack"}” and all its cards? Export a backup first if you want to keep it. This cannot be undone.`,
              )
            )
              onDelete();
          }}
        >
          Delete pack
        </button>
      </div>
    </div>
  );
}

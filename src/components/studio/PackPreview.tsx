"use client";

import { useState } from "react";
import { EmojiClue } from "@/components/game/EmojiClue";
import { AnswerReveal } from "@/components/game/AnswerReveal";
import type { CustomCard } from "@/types/custom-pack";
import { quietButtonClass, primaryButtonClass } from "./styles";

export function PackPreview({
  card,
  packName,
}: {
  card: CustomCard;
  packName: string;
}) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  return (
    <section
      aria-labelledby="preview-title"
      className="min-w-0 rounded-2xl border-2 border-[#d5e4df] bg-[#f3fbf7] p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="preview-title" className="text-xl font-black">
          Live preview
        </h3>
        <p className="text-sm text-[#435762]">Try the host controls</p>
      </div>
      <div className="mt-4 flex min-h-44 min-w-0 items-center overflow-hidden rounded-xl border-2 border-[#d5e4df] bg-white px-3 py-8">
        {card.emojis.trim() ? (
          <EmojiClue emojis={card.emojis} minFontSize={16} />
        ) : (
          <p className="w-full text-center text-[#435762]">
            Your emoji clue appears here.
          </p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          className={quietButtonClass}
          disabled={!card.hint.trim() || showAnswer}
          onClick={() => setShowHint(!showHint)}
        >
          {showHint ? "Hide hint" : "Hint"}
        </button>
        <button
          type="button"
          className={primaryButtonClass}
          disabled={!card.answer.trim()}
          onClick={() => {
            setShowAnswer(!showAnswer);
            setShowHint(false);
          }}
        >
          {showAnswer ? "Hide answer" : "Reveal"}
        </button>
      </div>
      {!card.hint.trim() && (
        <p className="mt-3 text-center text-sm text-[#435762]">
          Add a hint to try the Hint button.
        </p>
      )}
      <div className="mt-4 min-w-0 [overflow-wrap:anywhere]" aria-live="polite">
        <AnswerReveal
          categoryName={packName.trim() || "Your pack"}
          isAnswerVisible={showAnswer}
          isHintVisible={showHint}
          puzzle={{ ...card, categoryId: "custom" }}
        />
      </div>
    </section>
  );
}

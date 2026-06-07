export function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export const gameCardClassName =
  "rounded-[1.35rem] border-2 border-[#d5e4df] bg-white/90 text-[#17324d] shadow-[0_8px_0_rgba(23,50,77,0.08)]";

export const primaryPillActionClassName =
  "inline-flex min-h-14 items-center justify-center rounded-full border-2 border-transparent bg-[#ffca42] py-3 text-lg font-black text-[#17324d] shadow-[0_5px_0_#d79800] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f0cf74]";

export const primarySmallActionClassName =
  "inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-transparent bg-[#ffca42] px-5 py-3 text-base font-black text-[#17324d] shadow-[0_4px_0_#d79800] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f0cf74]";

export const secondaryActionClassName =
  "inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-transparent bg-[#17324d] px-4 py-3 text-base font-black text-white shadow-[0_4px_0_rgba(23,50,77,0.25)] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#8bc9c3]";

export const quietActionClassName =
  "inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-[#d5e4df] bg-white px-4 py-3 text-base font-black text-[#17324d] shadow-[0_3px_0_#d5e4df] transition hover:-translate-y-0.5 hover:bg-[#e1f5ef] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#8bc9c3]";

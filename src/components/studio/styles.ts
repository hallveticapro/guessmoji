import {
  quietActionClassName,
  primarySmallActionClassName,
} from "@/components/ui/styles";

export const fieldClass =
  "mt-2 block w-full min-w-0 rounded-xl border-2 border-[#8bc9c3] bg-white px-3 py-2.5 text-base text-[#17324d] placeholder:text-[#596d76] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#00778d]";
export const quietButtonClass = `${quietActionClassName} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0`;
export const primaryButtonClass = `${primarySmallActionClassName} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0`;

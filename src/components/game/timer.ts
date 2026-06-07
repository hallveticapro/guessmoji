export const MIN_TIMER_SECONDS = 0;
export const MAX_TIMER_SECONDS = 999;

export function coerceTimerSeconds(value: string | number): number {
  const parsedValue =
    typeof value === "number" ? value : Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue)) {
    return MIN_TIMER_SECONDS;
  }

  return Math.min(
    MAX_TIMER_SECONDS,
    Math.max(MIN_TIMER_SECONDS, parsedValue),
  );
}

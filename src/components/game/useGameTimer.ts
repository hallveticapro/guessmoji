import { useCallback, useEffect, useState } from "react";

const TIMER_PREFERENCE_KEY = "guessmoji:timerSeconds";

export function useGameTimer() {
  const [timerDuration, setTimerDuration] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerStopped, setIsTimerStopped] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const savedDuration = getSavedTimerDuration();

      if (savedDuration > 0) {
        setTimerDuration(savedDuration);
        setTimeRemaining(savedDuration);
        setIsTimerStopped(false);
      }
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (timerDuration <= 0 || isTimerStopped || timeRemaining <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeRemaining((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isTimerStopped, timeRemaining, timerDuration]);

  const resetTimer = useCallback(() => {
    setIsTimerStopped(false);
    setTimeRemaining(timerDuration);
  }, [timerDuration]);

  const stopTimer = useCallback(() => {
    setIsTimerStopped(true);
  }, []);

  const changeTimer = useCallback((duration: number, shouldStop: boolean) => {
    const safeDuration = Math.min(999, Math.max(0, duration));

    saveLocalPreference(TIMER_PREFERENCE_KEY, String(safeDuration));
    setTimerDuration(safeDuration);
    setTimeRemaining(safeDuration);
    setIsTimerStopped(shouldStop || safeDuration === 0);
  }, []);

  return {
    changeTimer,
    resetTimer,
    stopTimer,
    timerDuration,
    timeRemaining,
  };
}

function readLocalPreference(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function saveLocalPreference(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Local storage can be unavailable in locked-down browsers.
  }
}

function getSavedTimerDuration() {
  const savedTimer = readLocalPreference(TIMER_PREFERENCE_KEY);
  const savedDuration = savedTimer ? Number.parseInt(savedTimer, 10) : 0;

  if (Number.isNaN(savedDuration) || savedDuration <= 0) {
    return 0;
  }

  return Math.min(999, savedDuration);
}

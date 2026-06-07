import { useCallback, useEffect, useState } from "react";

export function useFullscreenMode() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreenMode = useCallback(async () => {
    try {
      if (!document.fullscreenEnabled) {
        return;
      }

      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await document.documentElement.requestFullscreen();
    } catch {
      // Some browsers or displays can deny fullscreen requests.
    } finally {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
  }, []);

  useEffect(() => {
    function syncFullscreenState() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    const timeoutId = window.setTimeout(syncFullscreenState, 0);
    document.addEventListener("fullscreenchange", syncFullscreenState);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("fullscreenchange", syncFullscreenState);
    };
  }, []);

  return { isFullscreen, toggleFullscreenMode };
}

import { useRef, useEffect } from "react";

/**
 * A custom hook that ensures the effect runs only once,
 * even in React Strict Mode (which double-invokes effects in development).
 *
 * @param effect The effect callback to run once.
 */
export function useOnce(effect: () => void | (() => void)) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

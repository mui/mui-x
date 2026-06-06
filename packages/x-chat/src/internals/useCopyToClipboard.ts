'use client';
import * as React from 'react';

export type CopyState = 'idle' | 'copied' | 'error';

export interface UseCopyToClipboardResult {
  copyState: CopyState;
  copy: (value: string) => void;
}

export function useCopyToClipboard(resetMs: number = 2000): UseCopyToClipboardResult {
  const [copyState, setCopyState] = React.useState<CopyState>('idle');
  const resetTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = React.useRef(true);
  // Monotonic token so a late-resolving write from a superseded `copy()` call
  // cannot overwrite the state set by a newer one.
  const copyTokenRef = React.useRef(0);

  React.useEffect(() => {
    // Reset on (re)mount: StrictMode and remounts run the cleanup below before
    // mounting again, so relying on the initial ref value would leave the hook
    // permanently flagged as unmounted and silently swallow every state update.
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (resetTimerRef.current !== null) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const setTemporaryState = React.useCallback(
    (nextState: CopyState) => {
      if (!mountedRef.current) {
        return;
      }
      setCopyState(nextState);
      if (resetTimerRef.current !== null) {
        clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setCopyState('idle');
        }
      }, resetMs);
    },
    [resetMs],
  );

  const copy = React.useCallback(
    (value: string) => {
      // Guard against environments without the async Clipboard API
      // (older browsers, insecure contexts, some test runners).
      if (
        typeof navigator === 'undefined' ||
        typeof navigator.clipboard?.writeText !== 'function'
      ) {
        setTemporaryState('error');
        return;
      }

      copyTokenRef.current += 1;
      const token = copyTokenRef.current;
      const isCurrent = () => token === copyTokenRef.current;

      try {
        // `writeText` can reject (permission denied) or, in some engines, throw
        // synchronously (document not focused) — handle both as 'error'.
        navigator.clipboard.writeText(value).then(
          () => {
            if (isCurrent()) {
              setTemporaryState('copied');
            }
          },
          () => {
            if (isCurrent()) {
              setTemporaryState('error');
            }
          },
        );
      } catch {
        if (isCurrent()) {
          setTemporaryState('error');
        }
      }
    },
    [setTemporaryState],
  );

  return { copyState, copy };
}

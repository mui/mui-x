'use client';
import * as React from 'react';

export type CopyState = 'idle' | 'copied';

export interface UseCopyToClipboardResult {
  copyState: CopyState;
  copy: (value: string) => void;
}

export function useCopyToClipboard(resetMs: number = 2000): UseCopyToClipboardResult {
  const [copyState, setCopyState] = React.useState<CopyState>('idle');
  const resetTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const copy = React.useCallback(
    (value: string) => {
      // Guard against environments without the async Clipboard API
      // (older browsers, insecure contexts, some test runners).
      if (
        typeof navigator === 'undefined' ||
        typeof navigator.clipboard?.writeText !== 'function'
      ) {
        return;
      }

      navigator.clipboard.writeText(value).then(
        () => {
          setCopyState('copied');
          if (resetTimerRef.current !== null) {
            clearTimeout(resetTimerRef.current);
          }
          resetTimerRef.current = setTimeout(() => setCopyState('idle'), resetMs);
        },
        () => {
          // Clipboard write failed (e.g. permissions denied) — no-op
        },
      );
    },
    [resetMs],
  );

  return { copyState, copy };
}

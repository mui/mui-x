'use client';
import * as React from 'react';

export type CopyState = 'idle' | 'copied' | 'error';

export interface UseCopyToClipboardResult {
  copyState: CopyState;
  copy: (value: string) => void;
}

/**
 * Synchronous `document.execCommand('copy')` fallback for environments without the
 * async Clipboard API (insecure `http://` origins, older browsers). Runs inside the
 * click handler's user gesture, so the copy is permitted. Returns whether it worked.
 */
function legacyCopy(value: string): boolean {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') {
    return false;
  }
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  // Keep it out of the layout/viewport so it can't scroll the page or flash.
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  try {
    textarea.select();
    textarea.setSelectionRange(0, value.length);
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
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
      copyTokenRef.current += 1;
      const token = copyTokenRef.current;
      const isCurrent = () => token === copyTokenRef.current;

      // Prefer the async Clipboard API when available (secure contexts, modern
      // browsers). Fall back to the synchronous `execCommand` path otherwise, so
      // insecure (`http://`) origins and older browsers still copy.
      if (typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function') {
        try {
          // `writeText` can reject (permission denied) or, in some engines, throw
          // synchronously (document not focused) — fall back to `execCommand`
          // before surfacing an error.
          navigator.clipboard.writeText(value).then(
            () => {
              if (isCurrent()) {
                setTemporaryState('copied');
              }
            },
            () => {
              if (isCurrent()) {
                setTemporaryState(legacyCopy(value) ? 'copied' : 'error');
              }
            },
          );
          return;
        } catch {
          // Fall through to the legacy path below.
        }
      }

      if (isCurrent()) {
        setTemporaryState(legacyCopy(value) ? 'copied' : 'error');
      }
    },
    [setTemporaryState],
  );

  return { copyState, copy };
}

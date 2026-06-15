'use client';
import * as React from 'react';

interface DocumentScrollLockState {
  count: number;
  restore: () => void;
}

interface DocumentScrollLock {
  lock: (element: Element | null | undefined) => void;
  unlock: () => void;
}

// Lock state is kept per-document so that calls are idempotent
// and so concurrent grids in the same document restore the original styles exactly once.
const lockStateByDocument = new WeakMap<Document, DocumentScrollLockState>();

/**
 * Prevents the page from scrolling while drag is in progress.
 *
 * During drag-and-drop the browser auto-scrolls the nearest scrollable ancestor
 * when the pointer approaches the viewport edge. While reordering rows this
 * scrolls the whole document away from the grid, making the drag unusable
 * (see https://github.com/mui/mui-x/issues/22718). The grid already provides its
 * own in-viewport auto-scroll through `GridScrollArea`, so the caller locks the
 * outer page scroll on drag start and unlocks it on drag end.
 *
 * The hook tracks the locked document and restores the scroll automatically if
 * the consumer unmounts mid-drag.
 */
export function useDocumentScrollLock(): DocumentScrollLock {
  const lockedDocument = React.useRef<Document | null>(null);

  const lock = React.useCallback((element: Element | null | undefined) => {
    lockedDocument.current = element?.ownerDocument ?? null;
    lockDocumentScroll(lockedDocument.current);
  }, []);

  const unlock = React.useCallback(() => {
    unlockDocumentScroll(lockedDocument.current);
    lockedDocument.current = null;
  }, []);

  // Restore the page scroll if the consumer unmounts while a drag is active.
  React.useEffect(() => unlock, [unlock]);

  return React.useMemo(() => ({ lock, unlock }), [lock, unlock]);
}

function lockDocumentScroll(doc: Document | null): void {
  if (!doc) {
    return;
  }

  const existingState = lockStateByDocument.get(doc);
  if (existingState) {
    existingState.count += 1;
    return;
  }

  const view = doc.defaultView;
  const scrollingElement = (doc.scrollingElement ?? doc.documentElement) as HTMLElement | null;
  if (!view || !scrollingElement) {
    return;
  }

  // The scrollbar width reclaimed by hiding the overflow, compensated as padding
  // so the page content does not shift horizontally while dragging.
  const scrollbarWidth = view.innerWidth - scrollingElement.clientWidth;

  // Lock both the scrolling element and `<body>`: the former is the actual scroll
  // container, the latter is a safety net for browsers that keep auto-scrolling
  // the root element.
  const elements = Array.from(
    new Set([scrollingElement, doc.body].filter(Boolean) as HTMLElement[]),
  );
  const previousStyles = new Map<HTMLElement, { overflow: string; paddingRight: string }>();

  elements.forEach((element) => {
    previousStyles.set(element, {
      overflow: element.style.overflow,
      paddingRight: element.style.paddingRight,
    });
    element.style.overflow = 'hidden';
  });

  if (scrollbarWidth > 0) {
    const currentPaddingRight = parseFloat(view.getComputedStyle(scrollingElement).paddingRight);
    scrollingElement.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
  }

  lockStateByDocument.set(doc, {
    count: 1,
    restore: () => {
      previousStyles.forEach((styles, element) => {
        element.style.overflow = styles.overflow;
        element.style.paddingRight = styles.paddingRight;
      });
    },
  });
}

function unlockDocumentScroll(doc: Document | null): void {
  if (!doc) {
    return;
  }

  const state = lockStateByDocument.get(doc);
  if (!state) {
    return;
  }

  state.count -= 1;
  if (state.count <= 0) {
    state.restore();
    lockStateByDocument.delete(doc);
  }
}

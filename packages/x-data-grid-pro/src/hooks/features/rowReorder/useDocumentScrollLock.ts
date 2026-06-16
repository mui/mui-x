'use client';
import * as React from 'react';

interface ElementScrollLockState {
  count: number;
  restore: () => void;
}

interface DocumentScrollLock {
  lock: (element: Element | null | undefined, scrollbarSize: number) => void;
  unlock: () => void;
}

// Lock state is kept per element so that calls are idempotent and so overlapping
// scroll-container chains restore the original styles exactly once.
const lockStateByElement = new WeakMap<HTMLElement, ElementScrollLockState>();

const SCROLLABLE_OVERFLOW = /(auto|scroll|overlay)/;

/**
 * Prevents the page from scrolling while a drag is in progress.
 *
 * During drag-and-drop the browser auto-scrolls the nearest scrollable ancestor
 * when the pointer approaches the viewport edge, then bubbles outwards. While
 * reordering rows this scrolls the grid's scrollable ancestors (and ultimately the
 * whole document) away from the grid, making the drag unusable (see
 * https://github.com/mui/mui-x/issues/22718). The grid already provides its own
 * in-viewport auto-scroll through `GridScrollArea`, so the caller locks every
 * vertically scrollable ancestor of the grid on drag start and unlocks them on drag
 * end.
 *
 * The hook tracks the locked elements and restores the scroll automatically if the
 * consumer unmounts mid-drag.
 */
export function useDocumentScrollLock(): DocumentScrollLock {
  const lockedElements = React.useRef<HTMLElement[]>([]);

  const lock = React.useCallback((element: Element | null | undefined, scrollbarSize: number) => {
    // Release any lock this instance already holds so repeated `lock` calls
    // (without an intervening `unlock`) stay balanced.
    lockedElements.current.forEach(unlockElementScroll);
    lockedElements.current = [];

    if (!element) {
      return;
    }
    const elements = getElementsToLock(element);
    elements.forEach((lockedElement) => lockElementScroll(lockedElement, scrollbarSize));
    lockedElements.current = elements;
  }, []);

  const unlock = React.useCallback(() => {
    lockedElements.current.forEach(unlockElementScroll);
    lockedElements.current = [];
  }, []);

  // Restore the page scroll if the consumer unmounts while a drag is active.
  React.useEffect(() => unlock, [unlock]);

  return React.useMemo(() => ({ lock, unlock }), [lock, unlock]);
}

function isVerticallyScrollable(element: Element, view: Window): boolean {
  const style = view.getComputedStyle(element);
  // Row reordering is a vertical operation, so only vertical scroll containers can
  // run away during the drag. Horizontal-only containers are left untouched.
  return SCROLLABLE_OVERFLOW.test(style.overflowY) && element.scrollHeight > element.clientHeight;
}

/**
 * Collects every element the browser could vertically auto-scroll while dragging
 * inside `element`: its vertically scrollable ancestors plus the document scroll
 * container. The grid's own scroller is intentionally excluded — the walk starts
 * above `element` — so the grid keeps scrolling itself through `GridScrollArea`.
 */
function getElementsToLock(element: Element): HTMLElement[] {
  const doc = element.ownerDocument;
  const view = doc.defaultView;
  if (!view) {
    return [];
  }

  const elements: HTMLElement[] = [];

  let current = element.parentElement;
  while (current) {
    if (isVerticallyScrollable(current, view)) {
      elements.push(current);
    }
    current = current.parentElement;
  }

  // The document scroll container (and `<body>` as a safety net for browsers that
  // keep auto-scrolling the root element). Their overflow is usually `visible`, so
  // they are not picked up by the ancestor walk above.
  const scrollingElement = (doc.scrollingElement ?? doc.documentElement) as HTMLElement | null;
  if (scrollingElement) {
    elements.push(scrollingElement);
  }
  if (doc.body) {
    elements.push(doc.body);
  }

  return Array.from(new Set(elements));
}

function lockElementScroll(element: HTMLElement, scrollbarSize: number): void {
  const existingState = lockStateByElement.get(element);
  if (existingState) {
    existingState.count += 1;
    return;
  }

  const view = element.ownerDocument.defaultView;
  if (!view) {
    return;
  }

  const style = view.getComputedStyle(element);
  // In RTL the vertical scrollbar sits on the left, so compensate that side.
  const verticalSide = style.direction === 'rtl' ? 'paddingLeft' : 'paddingRight';

  // Scrollbars reclaimed by `overflow: hidden` are compensated with padding so the
  // content does not shift. `scrollbarSize` is measured by the virtualizer.
  const vertical = element.scrollHeight > element.clientHeight ? scrollbarSize : 0;
  const horizontal = element.scrollWidth > element.clientWidth ? scrollbarSize : 0;

  const previousOverflowX = element.style.overflowX;
  const previousOverflowY = element.style.overflowY;
  const previousVerticalPadding = element.style[verticalSide];
  const previousPaddingBottom = element.style.paddingBottom;

  // Hide both axes (so the `overflow` shorthand is set), compensating each
  // scrollbar so neither a vertical nor a horizontal scrollbar disappearing shifts
  // the content.
  element.style.overflow = 'hidden';
  if (vertical > 0) {
    element.style[verticalSide] = `${(parseFloat(style[verticalSide]) || 0) + vertical}px`;
  }
  if (horizontal > 0) {
    element.style.paddingBottom = `${(parseFloat(style.paddingBottom) || 0) + horizontal}px`;
  }

  lockStateByElement.set(element, {
    count: 1,
    restore: () => {
      element.style.overflowX = previousOverflowX;
      element.style.overflowY = previousOverflowY;
      element.style[verticalSide] = previousVerticalPadding;
      element.style.paddingBottom = previousPaddingBottom;
    },
  });
}

function unlockElementScroll(element: HTMLElement): void {
  const state = lockStateByElement.get(element);
  if (!state) {
    return;
  }

  state.count -= 1;
  if (state.count <= 0) {
    state.restore();
    lockStateByElement.delete(element);
  }
}

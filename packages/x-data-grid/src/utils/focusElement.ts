import type * as React from 'react';
import type { GridPrivateApiCommunity } from '../models/api/gridApiCommunity';
import { doesSupportPreventScroll } from './doesSupportPreventScroll';

/**
 * Focuses an element while preserving the grid scroll position.
 *
 * Uses the native `preventScroll` focus option when supported, and otherwise
 * restores the scroll position manually after focusing.
 */
export function focusElement(
  element: HTMLElement,
  apiRef: React.RefObject<GridPrivateApiCommunity>,
): void {
  if (doesSupportPreventScroll()) {
    element.focus({ preventScroll: true });
  } else {
    const scrollPosition = apiRef.current.getScrollPosition();
    element.focus();
    apiRef.current.scroll(scrollPosition);
  }
}

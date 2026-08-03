import type { RefObject } from '@mui/x-internals/types';
import type { GridScrollApi } from '../models/api/gridScrollApi';
import { doesSupportPreventScroll } from './doesSupportPreventScroll';

/**
 * Focuses an element while preserving the grid scroll position.
 *
 * Uses the native `preventScroll` focus option when supported, and otherwise
 * restores the scroll position manually after focusing.
 */
export function focusElement<Api extends GridScrollApi>(
  element: HTMLElement,
  apiRef: RefObject<Api>,
): void {
  if (doesSupportPreventScroll()) {
    element.focus({ preventScroll: true });
  } else {
    const scrollPosition = apiRef.current.getScrollPosition();
    element.focus();
    apiRef.current.scroll(scrollPosition);
  }
}

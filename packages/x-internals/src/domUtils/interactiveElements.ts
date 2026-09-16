import type * as React from 'react';
import { getTarget } from './getTarget';

// Elements that own the keyboard and pointer events targeted at them. A `label` is included
// because clicking it activates its control without the control being in the event path.
const INTERACTIVE_ELEMENT_SELECTOR =
  'a[href], button, input, select, textarea, label, [contenteditable]:not([contenteditable="false"]), [tabindex]:not([tabindex="-1"])';

const TABBABLE_ELEMENT_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [contenteditable]:not([contenteditable="false"]), [tabindex]:not([tabindex="-1"])';

/**
 * Whether the event comes from an interactive element nested inside `currentTarget`.
 */
export function isEventFromNestedInteractiveElement(event: React.SyntheticEvent): boolean {
  const target = getTarget(event.nativeEvent);
  const interactive =
    target instanceof Element ? target.closest(INTERACTIVE_ELEMENT_SELECTOR) : null;
  if (interactive == null || interactive === event.currentTarget) {
    return false;
  }
  // `contains` does not cross shadow roots, the composed path does.
  return event.nativeEvent.composedPath().includes(event.currentTarget);
}

/**
 * The keyboard-focusable descendants of `container`, in DOM order.
 */
export function getTabbableDescendants(container: Element): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(TABBABLE_ELEMENT_SELECTOR));
}

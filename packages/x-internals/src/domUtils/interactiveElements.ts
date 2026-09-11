import type * as React from 'react';
import { getTarget } from './getTarget';

// Elements that own the keyboard and pointer events targeted at them.
const INTERACTIVE_ELEMENT_SELECTOR =
  'a[href], button, input, select, textarea, [contenteditable]:not([contenteditable="false"]), [tabindex]:not([tabindex="-1"])';

const TABBABLE_ELEMENT_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [contenteditable]:not([contenteditable="false"]), [tabindex]:not([tabindex="-1"])';

/**
 * Whether the event comes from an interactive element nested inside `currentTarget`.
 */
export function isEventFromNestedInteractiveElement(event: React.SyntheticEvent): boolean {
  const target = getTarget(event.nativeEvent);
  const interactive =
    target instanceof Element ? target.closest(INTERACTIVE_ELEMENT_SELECTOR) : null;
  return (
    interactive != null &&
    interactive !== event.currentTarget &&
    event.currentTarget.contains(interactive)
  );
}

/**
 * The keyboard-focusable descendants of `container`, in DOM order.
 */
export function getTabbableDescendants(container: Element): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(TABBABLE_ELEMENT_SELECTOR));
}

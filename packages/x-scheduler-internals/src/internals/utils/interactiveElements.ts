import type * as React from 'react';

// Elements that own the keyboard and pointer events targeted at them, such as the content
// rendered by a slot inside a cell or an event.
const INTERACTIVE_ELEMENT_SELECTOR =
  'a[href], button, input, select, textarea, [contenteditable]:not([contenteditable="false"]), [tabindex]:not([tabindex="-1"])';

const TABBABLE_ELEMENT_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [contenteditable]:not([contenteditable="false"]), [tabindex]:not([tabindex="-1"])';

/**
 * Whether the event comes from an interactive element nested inside `currentTarget`.
 */
export function isEventFromNestedInteractiveElement(event: React.SyntheticEvent): boolean {
  const target = event.target as Element | null;
  const interactive = target?.closest(INTERACTIVE_ELEMENT_SELECTOR);
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

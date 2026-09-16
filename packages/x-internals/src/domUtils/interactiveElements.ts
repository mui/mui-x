import type * as React from 'react';

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
  // Walk from the target up to `currentTarget` only, so a focusable ancestor of the trigger
  // (a grid column, a cell) never counts. The composed path also crosses shadow roots.
  for (const node of event.nativeEvent.composedPath()) {
    if (node === event.currentTarget) {
      return false;
    }
    if (node instanceof Element && node.matches(INTERACTIVE_ELEMENT_SELECTOR)) {
      return true;
    }
  }
  return false;
}

/**
 * The keyboard-focusable descendants of `container`, in DOM order.
 */
export function getTabbableDescendants(container: Element): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(TABBABLE_ELEMENT_SELECTOR));
}

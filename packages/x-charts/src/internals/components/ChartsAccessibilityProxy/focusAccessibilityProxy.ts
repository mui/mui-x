/**
 * Moves the DOM focus to the chart tab stop.
 * The proxy root is only tabbable while there is no description, otherwise one of the announcer
 * children holds the tab stop.
 * @param {HTMLDivElement | null} root The accessibility proxy root.
 * @returns {boolean} `true` when an element was focused.
 */
export function focusAccessibilityProxy(root: HTMLDivElement | null): boolean {
  if (!root) {
    return false;
  }

  const target =
    root.querySelector<HTMLElement>('[tabindex="0"]') ?? (root.tabIndex >= 0 ? root : null);

  // The proxy covers the whole chart, focusing it would scroll long pages.
  target?.focus({ preventScroll: true });

  return target !== null;
}

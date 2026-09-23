/**
 * The nearest surviving focusable ancestor of an element about to be removed from the DOM — e.g.
 * the grid column/cell an event lives in, which (unlike the event itself) doesn't unmount on
 * delete.
 *
 * A deletion removes `element` from the DOM once it applies (immediately, or once a scope/delete
 * confirmation dialog is resolved). Whatever tries to restore focus to `element` afterward — a
 * menu, a toolbar, or a dialog closing — silently fails once it's detached, losing focus to
 * `<body>`. Falling back to this ancestor keeps a keyboard user's place in the grid.
 */
export function getFocusFallback(element: HTMLElement): HTMLElement | null {
  return element.parentElement?.closest<HTMLElement>('[tabindex]') ?? null;
}

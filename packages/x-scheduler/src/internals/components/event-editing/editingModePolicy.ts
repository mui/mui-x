/**
 * Whether tapping an event should arm it (show its resize handles + action toolbar) rather than
 * opening the editing surface directly. A coarse pointer (touch/pen) can't hover to grab resize
 * handles, so it arms first; a fine pointer opens the surface. Mirrors the `@media (pointer: coarse)`
 * styling rules. Evaluated at interaction time, never during render, so it stays SSR-safe.
 */
export function prefersArmedOnTouch(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches
  );
}

export type EditingSurface = 'dialog' | 'drawer';

/**
 * Resolves the mode an occurrence opens in, keeping the decision in one place.
 * - When creating or when the event is read-only, the surface opens directly (`'edit'`): a creation
 *   draft has nothing to arm and a read-only event can be neither resized nor deleted.
 * - The compact drawer is the touch layout, so it always arms (`'armed'`).
 * - The dialog arms only on a coarse pointer; a fine pointer opens the surface directly (`'edit'`).
 *   See {@link prefersArmedOnTouch}.
 */
export function getInitialEditingMode(
  surface: EditingSurface,
  options: { isCreating?: boolean; isReadOnly?: boolean } = {},
): 'armed' | 'edit' {
  if (options.isCreating || options.isReadOnly) {
    return 'edit';
  }
  if (surface === 'drawer') {
    return 'armed';
  }
  return prefersArmedOnTouch() ? 'armed' : 'edit';
}

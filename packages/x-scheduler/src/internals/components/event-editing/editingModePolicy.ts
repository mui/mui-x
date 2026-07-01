/**
 * Whether tapping an event should arm it rather than open the surface directly: a coarse pointer can't
 * hover to grab resize handles, so it arms first. Evaluated at interaction time, so it stays SSR-safe.
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
 * Resolves the mode an occurrence opens in: creating/read-only opens the surface directly (`'edit'`),
 * the drawer always arms, and the dialog arms only on a coarse pointer ({@link prefersArmedOnTouch}).
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

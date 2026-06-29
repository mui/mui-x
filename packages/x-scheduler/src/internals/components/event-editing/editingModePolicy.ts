/**
 * Whether the editing surface should open on its read-only summary rather than the form.
 * A coarse pointer (touch/pen) can't hover to grab resize handles, so it opens on the summary
 * (with an edit affordance); a fine pointer opens the form. Mirrors the `@media (pointer: coarse)`
 * styling rules. Evaluated at interaction time, never during render, so it stays SSR-safe.
 */
export function prefersReadonlyEditingSurface(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches
  );
}

export type EditingSurface = 'dialog' | 'drawer';

/**
 * Resolves the mode an editing surface opens in, keeping the decision in one place.
 * - The compact drawer is peek-first: always opens on its summary, expands to the form on demand.
 * - The dialog opens the form when creating or on a fine pointer, the summary on a coarse pointer
 *   (see {@link prefersReadonlyEditingSurface}).
 */
export function getInitialEditingMode(
  surface: EditingSurface,
  options: { isCreating?: boolean } = {},
): 'readonly' | 'edit' {
  if (surface === 'drawer') {
    return 'readonly';
  }
  if (options.isCreating) {
    return 'edit';
  }
  return prefersReadonlyEditingSurface() ? 'readonly' : 'edit';
}

/**
 * Whether the editing surface should open on its read-only summary rather than the form.
 *
 * A coarse pointer (touch/pen) can't hover to grab resize handles, so an existing event opens on its
 * read-only summary first (with an edit affordance) and the surface stays usable for direct
 * manipulation; a fine pointer (mouse) opens the editing form directly. This mirrors the
 * `@media (pointer: coarse)` rules the surfaces already use for styling. It is evaluated at
 * interaction time (never during render), so it stays SSR-safe.
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
 * Resolves the mode an editing surface opens in, so the decision lives in one place instead of
 * being inlined per surface.
 *
 * - The compact drawer is peek-first by design: it always opens on its read-only summary and
 *   expands to the form on demand.
 * - The dialog opens the form directly when creating (there is nothing to preview) or on a fine
 *   pointer, and opens the read-only summary on a coarse pointer (see
 *   {@link prefersReadonlyEditingSurface}).
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

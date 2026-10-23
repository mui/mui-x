/**
 * Selects the wrapper of an edit component that the cell renders before edit mode starts.
 * See `experimentalFeatures.imeFastEdit`.
 */
export const PRE_MOUNTED_EDITOR_SELECTOR = '[data-cell-editor="preMounted"]';

/**
 * Tells if the event comes from an edit component that the cell renders before edit mode starts.
 */
export function isEventFromPreMountedEditor(event: { target: EventTarget | null }): boolean {
  const target = event.target as Element | null;
  return !!target?.closest?.(PRE_MOUNTED_EDITOR_SELECTOR);
}

/**
 * Selects the wrapper of the pre-mounted editor (`experimentalFeatures.imeFastEdit`).
 */
export const PRE_MOUNTED_EDITOR_SELECTOR = '[data-cell-editor="preMounted"]';

/**
 * Tells if the event comes from the pre-mounted editor.
 */
export function isEventFromPreMountedEditor(event: { target: EventTarget | null }): boolean {
  const target = event.target as Element | null;
  return !!target?.closest?.(PRE_MOUNTED_EDITOR_SELECTOR);
}

import type * as React from 'react';

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

/**
 * Tells if the keydown event belongs to an input method editor (IME) composition.
 * Some browsers send this keydown before `compositionstart`, for example Safari and Chrome on macOS.
 * Then `isComposing` is false, and `key` can be the composed character.
 * Only `keyCode` 229 identifies this keydown, so the check uses it, as MDN recommends.
 * See https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event#keydown_events_with_ime
 */
export function isImeKeyDown(event: React.KeyboardEvent): boolean {
  return event.nativeEvent?.isComposing || event.key === 'Process' || event.keyCode === 229;
}

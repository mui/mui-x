import * as React from 'react';

// Non printable keys have a name, for example "ArrowRight", see the whole list:
// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
// So event.key.length === 1 is often enough.
//
// However, we also need to ignore shortcuts, for example: select all:
// - Windows: Ctrl+A, event.ctrlKey is true
// - macOS: ⌘ Command+A, event.metaKey is true
export function isPrintableKey(event: React.KeyboardEvent<HTMLElement>): boolean {
  return event.key.length === 1 && !event.ctrlKey && !event.metaKey;
}

export const GRID_MULTIPLE_SELECTION_KEYS = ['Meta', 'Control', 'Shift'];
export const GRID_CELL_EXIT_EDIT_MODE_KEYS = ['Enter', 'Escape', 'Tab'];
export const GRID_CELL_EDIT_COMMIT_KEYS = ['Enter', 'Tab'];

export const isMultipleKey = (key: string): boolean =>
  GRID_MULTIPLE_SELECTION_KEYS.indexOf(key) > -1;

export const isCellEnterEditModeKeys = (event: React.KeyboardEvent<HTMLElement>): boolean =>
  isPrintableKey(event) ||
  event.key === 'Enter' ||
  event.key === 'Backspace' ||
  event.key === 'Delete';

export const isCellExitEditModeKeys = (key: string): boolean =>
  GRID_CELL_EXIT_EDIT_MODE_KEYS.indexOf(key) > -1;

export const isCellEditCommitKeys = (key: string): boolean =>
  GRID_CELL_EDIT_COMMIT_KEYS.indexOf(key) > -1;

export const isNavigationKey = (key: string) =>
  key.indexOf('Arrow') === 0 ||
  key.indexOf('Page') === 0 ||
  key === ' ' ||
  key === 'Home' ||
  key === 'End';

export const isKeyboardEvent = (event: any): event is React.KeyboardEvent<HTMLElement> =>
  !!event.key;

export const isHideMenuKey = (key: React.KeyboardEvent['key']) => key === 'Tab' || key === 'Escape';

// In theory, on macOS, ctrl + v doesn't trigger a paste, so the function should return false.
// However, maybe it's overkill to fix, so let's be lazy.
export function isPasteShortcut(event: React.KeyboardEvent) {
  return (
    (event.ctrlKey || event.metaKey) &&
    // We can't use event.code === 'KeyV' as event.code assumes a QWERTY keyboard layout,
    // for example, it would be another letter on a Dvorak physical keyboard.
    // We can't use event.key === 'v' as event.key is not stable with key modifiers and keyboard layouts,
    // for example, it would be ה on a Hebrew keyboard layout.
    // https://github.com/w3c/uievents/issues/377 could be a long-term solution
    String.fromCharCode(event.keyCode) === 'V' &&
    !event.shiftKey &&
    !event.altKey
  );
}

// Checks if the keyboard event corresponds to the copy shortcut (CTRL+C or CMD+C) across different localization keyboards.
export function isCopyShortcut(event: KeyboardEvent): boolean {
  return (
    (event.ctrlKey || event.metaKey) &&
    String.fromCharCode(event.keyCode) === 'C' &&
    !event.shiftKey &&
    !event.altKey
  );
}

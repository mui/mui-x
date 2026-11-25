'use client';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridNativeEventListener } from '../../utils/useGridNativeEventListener';
import { onFocusLeave } from '../../../utils/domUtils';

export const keyboardUseStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  keyboardUse: { active: false },
});

const MODIFIER_KEYS = new Set(['Alt', 'AltGraph', 'CapsLock', 'Control', 'Meta', 'Shift']);

// A modifier alone, or a shortcut like `Ctrl+C`, is also how a pointer user works.
function isKeyboardNavigation(event: KeyboardEvent) {
  if (MODIFIER_KEYS.has(event.key)) {
    return false;
  }
  return !((event.ctrlKey || event.metaKey) && event.key.length === 1);
}

/**
 * Tracks whether the user is using the keyboard or a pointer in the grid.
 */
export const useGridKeyboardUse = (apiRef: RefObject<GridPrivateApiCommunity>): void => {
  const setActive = (active: boolean) => {
    if (apiRef.current.state.keyboardUse.active === active) {
      return;
    }
    apiRef.current.setState((state) => ({ ...state, keyboardUse: { active } }));
  };

  const getRootElement = () => apiRef.current.rootElementRef.current;

  // A `Tab` counts on `keyup`, which only fires inside when the focus lands in the grid
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab' && isKeyboardNavigation(event)) {
      setActive(true);
    }
  };
  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      setActive(true);
    }
  };

  // The grid keeps its focused cell when the focus leaves it
  const handleFocusOut = (event: FocusEvent) => {
    const root = getRootElement();
    if (root) {
      onFocusLeave(root, event, () => setActive(false));
    }
  };

  // Native listeners, so a key that a feature marks as handled still counts
  useGridNativeEventListener(apiRef, getRootElement, 'keydown', handleKeyDown);
  useGridNativeEventListener(apiRef, getRootElement, 'keyup', handleKeyUp);
  useGridNativeEventListener(apiRef, getRootElement, 'focusout', handleFocusOut);
  useGridNativeEventListener(apiRef, getRootElement, 'pointerdown', () => setActive(false));
};

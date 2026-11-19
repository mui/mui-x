'use client';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridNativeEventListener } from '../../utils/useGridNativeEventListener';

export const keyboardUseStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  keyboardUse: { active: false },
});

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

  // Native listeners, so a key that a feature marks as handled still counts
  useGridNativeEventListener(apiRef, getRootElement, 'keydown', () => setActive(true));
  useGridNativeEventListener(apiRef, getRootElement, 'pointerdown', () => setActive(false));
};

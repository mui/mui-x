'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridNativeEventListener } from '../../utils/useGridNativeEventListener';
import { getActiveElement } from '../../../utils/domUtils';

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
  const getDocumentElement = () => getRootElement()?.ownerDocument.documentElement;

  // The headers and the rows, where the keys act. Not the toolbar or the footer.
  const isInMain = (target: EventTarget | null) =>
    !!apiRef.current.mainElementRef.current?.contains(target as Node | null);

  // The last input anywhere in the page, like `:focus-visible`.
  // For example the `Escape` that closes the column menu, which is in a portal.
  const lastInputRef = React.useRef<'keyboard' | 'pointer'>('pointer');

  const handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (!isKeyboardNavigation(event)) {
      return;
    }
    lastInputRef.current = 'keyboard';
    // In a shadow root, `event.target` is the host when the listener is on the document
    if (isInMain(event.composedPath()[0] ?? event.target)) {
      setActive(true);
    }
  };
  const handleDocumentPointerDown = () => {
    lastInputRef.current = 'pointer';
    setActive(false);
  };

  // The grid keeps its focused cell when the focus moves to the toolbar, the footer, or out
  const handleFocusIn = (event: FocusEvent) => {
    setActive(isInMain(event.target) && lastInputRef.current === 'keyboard');
  };
  const handleFocusOut = (event: FocusEvent) => {
    const root = getRootElement();
    if (!root || root.contains(event.relatedTarget as Node | null)) {
      return;
    }
    // Moving the focused row or column blurs it until React restores the focus
    setTimeout(() => {
      if (!isInMain(getActiveElement(root.ownerDocument))) {
        setActive(false);
      }
    });
  };

  // Native listeners in the capture phase, so a key that a feature handles still counts
  useGridNativeEventListener(apiRef, getDocumentElement, 'keydown', handleDocumentKeyDown, {
    capture: true,
  });
  useGridNativeEventListener(apiRef, getDocumentElement, 'pointerdown', handleDocumentPointerDown, {
    capture: true,
  });
  useGridNativeEventListener(apiRef, getRootElement, 'focusin', handleFocusIn);
  useGridNativeEventListener(apiRef, getRootElement, 'focusout', handleFocusOut);
};

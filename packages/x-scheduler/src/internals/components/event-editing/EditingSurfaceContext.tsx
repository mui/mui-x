'use client';
import * as React from 'react';

/**
 * The kind of editing surface currently active.
 *
 * - `'dialog'`: the anchored, draggable desktop event dialog.
 * - `'drawer'`: the in-flow compact (mobile) editing drawer.
 */
export type EditingSurface = 'dialog' | 'drawer';

/**
 * Tells surface-agnostic components (e.g. the recurring scope confirmation) which editing surface
 * is rendering them, so a single renderer can pick the right shell — a centered dialog on desktop
 * or a bottom-sheet drawer on compact. Defaults to `'dialog'` so components rendered outside a
 * compact surface (and in isolation in tests) keep the desktop behavior.
 */
export const EditingSurfaceContext = React.createContext<EditingSurface>('dialog');

export function useEditingSurface(): EditingSurface {
  return React.useContext(EditingSurfaceContext);
}

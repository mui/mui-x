'use client';
import * as React from 'react';

export interface GridContextMenuAnchorPosition {
  top: number;
  left: number;
}

export interface OpenGridContextMenuParameters {
  /**
   * The grid cell, column or row that was right-clicked.
   */
  anchorEl: HTMLElement;
  /**
   * The point the menu is anchored to.
   */
  anchorPosition: GridContextMenuAnchorPosition;
  /**
   * Starts the event creation flow at the right-clicked date (and resource).
   * Not provided when event creation is disabled.
   */
  createEvent?: (event?: Event) => void;
}

export interface GridContextMenuContextValue {
  /**
   * Opens the menu shown on right-click of the grid outside any event.
   */
  openMenu: (parameters: OpenGridContextMenuParameters) => void;
}

/**
 * Provided by the styled layer, which renders the menu itself.
 * Without a provider, right-clicking the grid keeps the native browser behavior.
 */
export const GridContextMenuContext = React.createContext<GridContextMenuContextValue | undefined>(
  undefined,
);

export function useGridContextMenuContext(): GridContextMenuContextValue | undefined {
  return React.useContext(GridContextMenuContext);
}

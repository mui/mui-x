'use client';
import * as React from 'react';

export type GridCellRowType = 'header' | 'day-grid' | 'time-grid';

export interface GridCellCoordinates {
  rowType: GridCellRowType;
  columnIndex: number;
}

export interface CalendarGridRootContext {
  /**
   * The id of the grid (used for accessibility purposes).
   */
  id: string | undefined;
  /**
   * The coordinates of the cell that currently holds the roving tabIndex.
   * `null` when no cell has been focused via keyboard yet.
   */
  focusedCell: GridCellCoordinates | null;
  /**
   * Updates the focused cell coordinates.
   * The cell matching these coordinates will receive `tabIndex={0}` and DOM focus.
   */
  setFocusedCell: (rowType: GridCellRowType, columnIndex: number) => void;
}

export const CalendarGridRootContext = React.createContext<CalendarGridRootContext | undefined>(
  undefined,
);

export function useCalendarGridRootContext() {
  const context = React.useContext(CalendarGridRootContext);
  if (context === undefined) {
    throw new Error(
      'MUI: `CalendarGridRootContext` is missing. CalendarGrid parts must be placed within <CalendarGrid.Root />.',
    );
  }
  return context;
}

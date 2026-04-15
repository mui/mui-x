'use client';
import * as React from 'react';

export type GridRowType = 'header' | 'day-grid' | 'time-grid';

export interface GridCellCoordinates {
  rowType: GridRowType;
  rowIndex: number;
  columnIndex: number;
}

export interface CalendarGridRootContext {
  /**
   * The id of the grid (used for accessibility purposes).
   */
  id: string | undefined;
  /**
   * The coordinates of the cell that currently has keyboard focus.
   * Controls which cell's interactive children (events) are in the Tab order.
   * `null` when no cell has been focused via keyboard yet.
   */
  focusedCell: GridCellCoordinates | null;
  /**
   * Updates the focused cell coordinates.
   * The cell matching these coordinates will receive `tabIndex={0}` and DOM focus.
   */
  setFocusedCell: (rowType: GridRowType, rowIndex: number, columnIndex: number) => void;
  /**
   * The ordered list of row types that are rendered in the grid.
   * Used for vertical arrow-key navigation so it only targets rows that actually exist.
   */
  rowTypes: GridRowType[];
  /**
   * The number of rows for each row type.
   * Defaults to 1 for row types not specified.
   * Month view uses this to indicate multiple week rows (e.g., `{ 'day-grid': 5 }`).
   */
  rowsPerType: Partial<Record<GridRowType, number>>;
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

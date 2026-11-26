'use client';
import * as React from 'react';
import type { GridRowType, GridCellCoordinates } from '../../models/calendarGrid';

export interface CalendarGridCellRegistration {
  /**
   * The coordinates of the cell.
   */
  coordinates: GridCellCoordinates;
  /**
   * Creates an event in the cell, `undefined` when the cell can't create one.
   */
  createEvent: ((event: Event) => void) | undefined;
}

export interface CalendarGridRootContext {
  /**
   * The id of the grid (used for accessibility purposes).
   */
  id: string | undefined;
  /**
   * The coordinates of the cell that currently has keyboard focus.
   * `null` when focus is outside of the grid's cells.
   */
  focusedCell: GridCellCoordinates | null;
  /**
   * Updates the focused cell coordinates.
   * The cell matching these coordinates receives DOM focus and becomes the tab stop of the grid.
   */
  setFocusedCell: (coordinates: GridCellCoordinates) => void;
  /**
   * Whether the cell is the single tab stop of the grid.
   */
  isTabStop: (coordinates: GridCellCoordinates) => boolean;
  /**
   * Moves focus to the first item of the cell (Enter or F2).
   * Returns `false` when the cell has no items.
   */
  enterCell: (cell: HTMLElement) => boolean;
  /**
   * Registers a cell so the grid can map its element to its coordinates.
   * Returns the cleanup.
   */
  registerCell: (cell: HTMLElement, registration: CalendarGridCellRegistration) => () => void;
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
      'MUI X Scheduler: `CalendarGridRootContext` is missing. CalendarGrid parts must be placed within <CalendarGrid.Root />.',
    );
  }
  return context;
}

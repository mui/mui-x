'use client';
import * as React from 'react';

/**
 * The type of column in the timeline grid.
 * - `'title'` — the resource name column on the left
 * - `'events'` — the events column on the right
 */
export type TimelineGridColumnType = 'title' | 'events';

/**
 * The coordinates of a focused cell in the timeline grid.
 */
export interface TimelineGridCellCoordinates {
  readonly columnType: TimelineGridColumnType;
  readonly rowIndex: number;
}

export interface TimelineGridRootContext {
  /**
   * The coordinates of the cell that currently has keyboard focus.
   * `null` when no cell has been focused via keyboard yet.
   */
  focusedCell: TimelineGridCellCoordinates | null;
  /**
   * Updates the focused cell coordinates.
   */
  setFocusedCell: (coordinates: TimelineGridCellCoordinates) => void;
  /**
   * The ordered list of column types that are rendered in the grid.
   */
  columnTypes: TimelineGridColumnType[];
}

export const DEFAULT_COLUMN_TYPES: TimelineGridColumnType[] = ['title', 'events'];

export const TimelineGridRootContext = React.createContext<TimelineGridRootContext | undefined>(
  undefined,
);

export function useTimelineGridRootContext() {
  const context = React.useContext(TimelineGridRootContext);
  if (context === undefined) {
    throw new Error(
      'MUI X Scheduler: TimelineGridRootContext is missing. ' +
        'TimelineGrid parts must be placed within <TimelineGrid.Root />.',
    );
  }
  return context;
}

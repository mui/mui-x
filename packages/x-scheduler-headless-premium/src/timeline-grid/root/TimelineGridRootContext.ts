'use client';
import * as React from 'react';
import type {
  TimelineGridColumnType,
  TimelineGridCellCoordinates,
} from '../../models/timelineGrid';

export interface TimelineGridRootContext {
  /**
   * The coordinates of the cell that currently owns focus within the grid.
   * `null` when focus is outside the grid.
   */
  focusedCell: TimelineGridCellCoordinates | null;
  /**
   * Updates the focused cell coordinates, or clears them when passed `null`.
   */
  setFocusedCell: (coordinates: TimelineGridCellCoordinates | null) => void;
  /**
   * Clears the focused cell only if it still matches the given coordinates.
   */
  clearFocusedCellIfMatches: (columnType: TimelineGridColumnType, rowIndex: number) => void;
  /**
   * The ordered list of column types that are rendered in the grid.
   */
  columnTypes: readonly [TimelineGridColumnType, ...TimelineGridColumnType[]];
}

export const DEFAULT_COLUMN_TYPES = ['title', 'events'] as const satisfies readonly [
  TimelineGridColumnType,
  ...TimelineGridColumnType[],
];

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

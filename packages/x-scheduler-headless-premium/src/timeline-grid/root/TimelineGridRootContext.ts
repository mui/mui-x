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

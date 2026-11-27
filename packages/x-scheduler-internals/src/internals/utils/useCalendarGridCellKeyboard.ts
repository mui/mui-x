'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useDirection } from '@base-ui/react/direction-provider';
import type { GridCellCoordinates, GridRowType } from '../../models/calendarGrid';
import { useCalendarGridRootContext } from '../../calendar-grid/root/CalendarGridRootContext';
import { getNavigationTarget } from './getNavigationTarget';
import { useCalendarGridCellsRefsContext } from './CalendarGridCellsRefsContext';

/**
 * The keyboard behavior shared by the cells of the calendar grid: a roving tab stop, the arrow
 * keys to move between cells, and Enter or F2 to move into the cell's items. It also registers the
 * cell, so C creates an event in it.
 */
export function useCalendarGridCellKeyboard(
  parameters: useCalendarGridCellKeyboard.Parameters,
): useCalendarGridCellKeyboard.ReturnValue {
  const { rowType, rowIndex, columnIndex, cellRef, createEvent, onEnter } = parameters;

  const { focusCell, isTabStop, enterCell, registerCell, rowTypes, rowsPerType } =
    useCalendarGridRootContext();
  const isRtl = useDirection() === 'rtl';
  const cellsRefs = useCalendarGridCellsRefsContext();

  const coordinates = React.useMemo<GridCellCoordinates>(
    () => ({ rowType, rowIndex, columnIndex }),
    [rowType, rowIndex, columnIndex],
  );

  const stableCreateEvent = useStableCallback((event: Event) => createEvent?.(event));
  const canCreateEvent = createEvent != null;

  useIsoLayoutEffect(() => {
    const cell = cellRef.current;
    if (cell == null) {
      return undefined;
    }
    return registerCell(cell, {
      coordinates,
      createEvent: canCreateEvent ? stableCreateEvent : undefined,
    });
  }, [cellRef, coordinates, canCreateEvent, stableCreateEvent, registerCell]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    const target = getNavigationTarget(event.key, rowType, rowIndex, columnIndex, {
      columnCount: cellsRefs.current.length,
      rowTypes,
      rowsPerType,
      isRtl,
    });
    if (target) {
      event.preventDefault();
      focusCell(target);
      return;
    }

    if (event.key === 'Enter' || event.key === 'F2') {
      if (onEnter) {
        onEnter(event);
      } else if (enterCell(event.currentTarget)) {
        event.preventDefault();
      }
    }
  };

  return {
    tabIndex: isTabStop(coordinates) ? 0 : -1,
    onKeyDown,
  };
}

export namespace useCalendarGridCellKeyboard {
  export interface Parameters {
    rowType: GridRowType;
    rowIndex: number;
    columnIndex: number;
    cellRef: React.RefObject<HTMLDivElement | null>;
    /**
     * Creates an event in the cell when C is pressed, `undefined` when the cell can't create one.
     */
    createEvent?: (event: Event) => void;
    /**
     * Replaces moving into the cell's items on Enter or F2.
     */
    onEnter?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  }

  /**
   * The props to spread on the cell.
   */
  export interface ReturnValue {
    tabIndex: number;
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  }
}

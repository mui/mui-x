'use client';
import * as React from 'react';
import { useId } from '@base-ui/utils/useId';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { useDirection } from '@base-ui/react/direction-provider';
import { DEFAULT_ROW_TYPES } from '../../internals/utils/getNavigationTarget';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { schedulerOtherSelectors } from '../../scheduler-selectors';
import {
  CALENDAR_GRID_ITEM_ATTRIBUTE,
  focusCalendarGridItem,
  getCalendarGridCellItems,
  getCalendarGridItemOffset,
} from '../../internals/utils/calendar-grid-items';
import type { GridCellCoordinates, GridRowType } from '../../models/calendarGrid';
import { CalendarGridRootContext } from './CalendarGridRootContext';
import type { CalendarGridCellRegistration } from './CalendarGridRootContext';

const DEFAULT_ROWS_PER_TYPE: Partial<Record<GridRowType, number>> = {};

function isSameCell(a: GridCellCoordinates | null, b: GridCellCoordinates | null) {
  return (
    a != null &&
    b != null &&
    a.rowType === b.rowType &&
    a.rowIndex === b.rowIndex &&
    a.columnIndex === b.columnIndex
  );
}

/**
 * C, without the modifiers used by the browser and the assistive technologies.
 * On a layout without Latin letters (Cyrillic, Greek), the key in the position of C.
 */
function isCreateEventKey(event: React.KeyboardEvent) {
  const isC =
    event.key.toLowerCase() === 'c' || (event.code === 'KeyC' && !/^[a-z]$/i.test(event.key));
  return isC && !event.ctrlKey && !event.metaKey && !event.altKey && !event.nativeEvent.isComposing;
}

export const CalendarGridRoot = React.forwardRef(function CalendarGridRoot(
  componentProps: CalendarGridRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Internal props
    id: idProp,
    rowTypes = DEFAULT_ROW_TYPES,
    rowsPerType: rowsPerTypeProp = DEFAULT_ROWS_PER_TYPE,
    defaultFocusedCell,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const id = useId(idProp);
  const rowsPerType = rowsPerTypeProp;
  const isRtl = useDirection() === 'rtl';
  const store = useSchedulerStoreContext(true);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const cellsRef = React.useRef(new Map<HTMLElement, CalendarGridCellRegistration>());
  // The cell whose items the keyboard moves through, `null` while moving between cells.
  // Read in focus handlers that run before a re-render, so it is not a state.
  const enteredCellRef = React.useRef<HTMLElement | null>(null);

  const [focusedCell, setFocusedCellState] = React.useState<GridCellCoordinates | null>(null);
  // The tab stop, kept when focus leaves the grid so Tab comes back to the same cell.
  const [activeCell, setActiveCell] = React.useState<GridCellCoordinates | null>(null);

  // A new default (for example once the visible days change) resets the tab stop.
  const [prevDefaultFocusedCell, setPrevDefaultFocusedCell] = React.useState(defaultFocusedCell);
  if (prevDefaultFocusedCell !== defaultFocusedCell) {
    setPrevDefaultFocusedCell(defaultFocusedCell);
    setActiveCell(null);
  }

  const fallbackTabStop = React.useMemo<GridCellCoordinates>(
    () => ({
      rowType: rowTypes.find((rowType) => rowType !== 'header') ?? rowTypes[0],
      rowIndex: 0,
      columnIndex: 0,
    }),
    [rowTypes],
  );
  const tabStop = activeCell ?? defaultFocusedCell ?? fallbackTabStop;

  const setFocusedCell = React.useCallback((coordinates: GridCellCoordinates) => {
    setFocusedCellState((prev) => (isSameCell(prev, coordinates) ? prev : coordinates));
    setActiveCell((prev) => (isSameCell(prev, coordinates) ? prev : coordinates));
  }, []);

  const isTabStop = React.useCallback(
    (coordinates: GridCellCoordinates) => isSameCell(tabStop, coordinates),
    [tabStop],
  );

  const registerCell = React.useCallback(
    (cell: HTMLElement, registration: CalendarGridCellRegistration) => {
      cellsRef.current.set(cell, registration);
      return () => {
        if (cellsRef.current.get(cell) === registration) {
          cellsRef.current.delete(cell);
        }
      };
    },
    [],
  );

  const enterCell = React.useCallback((cell: HTMLElement) => {
    const [firstItem] = getCalendarGridCellItems(cell);
    if (firstItem == null) {
      return false;
    }
    enteredCellRef.current = cell;
    firstItem.focus();
    return true;
  }, []);

  const exitCell = (cell: HTMLElement) => {
    enteredCellRef.current = null;
    cell.focus({ preventScroll: true });
  };

  const isInGrid = (target: EventTarget) => rootRef.current?.contains(target as Node) === true;

  const handleFocus = useStableCallback((event: React.FocusEvent<HTMLDivElement>) => {
    const target = event.target;
    // Events from portals (popovers, dialogs) bubble through the React tree too.
    if (!isInGrid(target)) {
      return;
    }
    if (cellsRef.current.has(target)) {
      enteredCellRef.current = null;
      return;
    }
    if (!target.hasAttribute(CALENDAR_GRID_ITEM_ATTRIBUTE)) {
      return;
    }
    // An item of a multi-day event can be focused from another cell of its row.
    const enteredCell = enteredCellRef.current;
    if (enteredCell != null && getCalendarGridCellItems(enteredCell).includes(target)) {
      return;
    }
    // Focused another way, for example by a click or once a dialog closes.
    const cell = Array.from(cellsRef.current.keys()).find((element) => element.contains(target));
    enteredCellRef.current = cell ?? null;
    const coordinates = cell != null ? cellsRef.current.get(cell)!.coordinates : null;
    if (coordinates != null && !isSameCell(coordinates, tabStop)) {
      setActiveCell(coordinates);
    }
  });

  const handleBlur = useStableCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (!rootRef.current?.contains(event.relatedTarget as Node)) {
      setFocusedCellState(null);
      enteredCellRef.current = null;
    }
  });

  const handleKeyDown = useStableCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target;
    if (event.defaultPrevented || !isInGrid(target)) {
      return;
    }

    const enteredCell = enteredCellRef.current;
    const cell = cellsRef.current.has(target as HTMLElement)
      ? (target as HTMLElement)
      : enteredCell;
    if (cell == null) {
      return;
    }

    if (isCreateEventKey(event)) {
      const createEvent = cellsRef.current.get(cell)?.createEvent;
      if (createEvent) {
        event.preventDefault();
        createEvent(event.nativeEvent);
      }
      return;
    }

    if (cell !== enteredCell || target === cell) {
      return;
    }

    if (event.key === 'Escape' || event.key === 'F2') {
      // Escape disarms an armed event first (`useDisarmOnEscape`), the next one leaves the cell.
      if (
        event.key === 'Escape' &&
        store != null &&
        schedulerOtherSelectors.editingMode(store.state) === 'armed'
      ) {
        return;
      }
      event.preventDefault();
      exitCell(cell);
      return;
    }

    let offset = getCalendarGridItemOffset(event.key, isRtl);
    if (event.key === 'Tab') {
      offset = event.shiftKey ? -1 : 1;
    }
    if (offset === 0) {
      return;
    }

    const items = getCalendarGridCellItems(cell);
    const index = items.indexOf(target as HTMLElement);
    if (index === -1) {
      return;
    }
    event.preventDefault();
    focusCalendarGridItem(items, index + offset);
  });

  const contextValue: CalendarGridRootContext = React.useMemo(
    () => ({
      id,
      focusedCell,
      setFocusedCell,
      isTabStop,
      enterCell,
      registerCell,
      rowTypes,
      rowsPerType,
    }),
    [id, focusedCell, setFocusedCell, isTabStop, enterCell, registerCell, rowTypes, rowsPerType],
  );

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, rootRef],
    props: [
      elementProps,
      {
        role: 'grid',
        id,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
      },
    ],
  });

  return (
    <CalendarGridRootContext.Provider value={contextValue}>
      {element}
    </CalendarGridRootContext.Provider>
  );
});

export namespace CalendarGridRoot {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The ordered list of row types that are rendered in the grid.
     * Used for vertical arrow-key navigation so it only targets rows that actually exist.
     * @default ['header', 'day-grid', 'time-grid']
     */
    rowTypes?: GridRowType[];
    /**
     * The number of rows for each row type.
     * Defaults to 1 for row types not specified.
     * Month view uses this to indicate multiple week rows (e.g., `{ 'day-grid': 5 }`).
     * @default {}
     */
    rowsPerType?: Partial<Record<GridRowType, number>>;
    /**
     * The cell that is the tab stop of the grid until a cell is focused, usually the current day.
     * Passing a new object resets the tab stop to it.
     * Defaults to the first cell of the first row that is not the header.
     */
    defaultFocusedCell?: GridCellCoordinates;
  }
}

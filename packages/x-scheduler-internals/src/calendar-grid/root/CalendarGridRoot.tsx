'use client';
import * as React from 'react';
import { useId } from '@base-ui/utils/useId';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { DEFAULT_ROW_TYPES } from '../../internals/utils/getNavigationTarget';
import type { GridCellCoordinates, GridRowType } from '../../models/calendarGrid';
import { CalendarGridRootContext } from './CalendarGridRootContext';

const DEFAULT_ROWS_PER_TYPE: Partial<Record<GridRowType, number>> = {};

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
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const id = useId(idProp);
  const rowsPerType = rowsPerTypeProp;

  const rootRef = React.useRef<HTMLDivElement>(null);

  const [focusedCell, setFocusedCellState] = React.useState<GridCellCoordinates | null>(null);

  const setFocusedCell = React.useCallback((coordinates: GridCellCoordinates) => {
    setFocusedCellState((prev) =>
      prev?.rowType === coordinates.rowType &&
      prev.rowIndex === coordinates.rowIndex &&
      prev.columnIndex === coordinates.columnIndex
        ? prev
        : coordinates,
    );
  }, []);

  const handleBlur = React.useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (!rootRef.current?.contains(event.relatedTarget as Node)) {
      setFocusedCellState(null);
    }
  }, []);

  const contextValue: CalendarGridRootContext = React.useMemo(
    () => ({ id, focusedCell, setFocusedCell, rowTypes, rowsPerType }),
    [id, focusedCell, setFocusedCell, rowTypes, rowsPerType],
  );

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, rootRef],
    props: [elementProps, { role: 'grid', id, onBlur: handleBlur }],
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
  }
}

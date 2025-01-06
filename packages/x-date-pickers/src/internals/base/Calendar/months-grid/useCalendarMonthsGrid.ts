import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { navigateInGrid } from '../utils/keyboardNavigation';
import { useCalendarMonthCellCollection } from '../utils/month-cell-collection/useCalendarMonthCellCollection';

export function useCalendarMonthsGrid(parameters: useCalendarMonthsGrid.Parameters) {
  const { children, cellsPerRow } = parameters;
  const calendarMonthsCellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { months, context } = useCalendarMonthCellCollection();

  // TODO: Add support for multiple months grids.
  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    const grid: HTMLElement[][] = Array.from(
      {
        length: Math.ceil(calendarMonthsCellRefs.current.length / cellsPerRow),
      },
      () => [],
    );
    calendarMonthsCellRefs.current.forEach((cell, index) => {
      const rowIndex = Math.floor(index / cellsPerRow);
      if (cell != null) {
        grid[rowIndex].push(cell);
      }
    });

    navigateInGrid({
      cells: [grid],
      event,
      changePage: undefined,
    });
  });

  const getMonthGridProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'radiogroup',
        children: children == null ? null : children({ months }),
        onKeyDown,
      });
    },
    [months, children, onKeyDown],
  );

  return React.useMemo(
    () => ({ getMonthGridProps, context, calendarMonthsCellRefs }),
    [getMonthGridProps, context, calendarMonthsCellRefs],
  );
}

export namespace useCalendarMonthsGrid {
  export interface Parameters {
    /**
     * Cells rendered per row.
     * This is used to make sure the keyboard navigation works correctly.
     */
    cellsPerRow: number;
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    months: PickerValidDate[];
  }
}

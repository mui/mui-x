import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { navigateInGrid } from '../utils/keyboardNavigation';
import { useYearsCells } from '../utils/useYearsCells';
import { CalendarYearsGridCssVars } from './CalendarYearsGridCssVars';

export function useCalendarYearsGrid(parameters: useCalendarYearsGrid.Parameters) {
  const { children, cellsPerRow } = parameters;
  const yearsCellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { years } = useYearsCells();

  const getCellsInCalendar = useEventCallback(() => {
    const grid: HTMLElement[][] = Array.from(
      {
        length: Math.ceil(yearsCellRefs.current.length / cellsPerRow),
      },
      () => [],
    );
    yearsCellRefs.current.forEach((cell, index) => {
      const rowIndex = Math.floor(index / cellsPerRow);
      if (cell != null) {
        grid[rowIndex].push(cell);
      }
    });

    return [grid];
  });

  // TODO: Add support for multiple years grids.
  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    navigateInGrid({
      cells: getCellsInCalendar(),
      event,
      changePage: undefined,
    });
  });

  const getYearsGridProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'radiogroup',
        children: children == null ? null : children({ years }),
        onKeyDown,
        style: {
          [CalendarYearsGridCssVars.calendarYearsGridCellsPerRow]: cellsPerRow,
        },
      });
    },
    [years, children, onKeyDown, cellsPerRow],
  );

  return React.useMemo(
    () => ({ getYearsGridProps, yearsCellRefs }),
    [getYearsGridProps, yearsCellRefs],
  );
}

export namespace useCalendarYearsGrid {
  export interface Parameters {
    /**
     * Cells rendered per row.
     * This is used to make sure the keyboard navigation works correctly.
     */
    cellsPerRow: number;
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    years: PickerValidDate[];
  }
}

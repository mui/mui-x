import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { navigateInGrid } from '../utils/keyboardNavigation';
import { useCalendarYearsCellCollection } from '../utils/years-cell-collection/useCalendarYearsCellCollection';

export function useCalendarYearsGrid(parameters: useCalendarYearsGrid.Parameters) {
  const { children, cellsPerRow } = parameters;
  const yearsCellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { years, context } = useCalendarYearsCellCollection();

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
      });
    },
    [years, children, onKeyDown],
  );

  return React.useMemo(
    () => ({ getYearsGridProps, context, yearsCellRefs }),
    [getYearsGridProps, context, yearsCellRefs],
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

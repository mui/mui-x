import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeProps } from '../../base-utils/mergeProps';
import { navigateInGrid } from '../../utils/base-calendar/utils/keyboardNavigation';
import { useYearCells } from '../utils/useYearCells';

export function useCalendarYearGrid(parameters: useCalendarYearGrid.Parameters) {
  const { children, cellsPerRow, cellsPerRowCssVar, getItems, focusOnMount } = parameters;
  const yearsCellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { resolvedChildren, scrollerRef, yearsListOrGridContext } = useYearCells({
    getItems,
    focusOnMount,
    children,
  });

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

  const getYearGridProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeProps(externalProps, {
        role: 'radiogroup',
        children: resolvedChildren,
        onKeyDown,
        style: {
          [cellsPerRowCssVar]: cellsPerRow,
        },
      });
    },
    [resolvedChildren, onKeyDown, cellsPerRow, cellsPerRowCssVar],
  );

  return React.useMemo(
    () => ({ getYearGridProps, yearsCellRefs, yearsListOrGridContext, scrollerRef }),
    [getYearGridProps, yearsCellRefs, yearsListOrGridContext, scrollerRef],
  );
}

export namespace useCalendarYearGrid {
  export interface PublicParameters extends useYearCells.Parameters {
    /**
     * Cells rendered per row.
     * This is used to make sure the keyboard navigation works correctly.
     */
    cellsPerRow: number;
  }

  export interface Parameters extends PublicParameters {
    /**
     * The CSS variable that must contain the number of cells per row.
     */
    cellsPerRowCssVar: string;
  }

  export interface ChildrenParameters {
    /**
     * The list of years to render.
     */
    years: PickerValidDate[];
  }
}

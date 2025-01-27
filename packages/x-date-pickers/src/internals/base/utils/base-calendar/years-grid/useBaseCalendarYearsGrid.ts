import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../../models';
import { GenericHTMLProps } from '../../../base-utils/types';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';
import { navigateInGrid } from '../utils/keyboardNavigation';
import { useYearsCells } from '../utils/useYearsCells';

export function useBaseCalendarYearsGrid(parameters: useBaseCalendarYearsGrid.Parameters) {
  const { children, cellsPerRow, cellsPerRowCssVar, getItems, focusOnMount } = parameters;
  const yearsCellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { items, scrollerRef, yearsListOrGridContext } = useYearsCells({ getItems, focusOnMount });

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
        children: children == null ? null : children({ years: items }),
        onKeyDown,
        style: {
          [cellsPerRowCssVar]: cellsPerRow,
        },
      });
    },
    [items, children, onKeyDown, cellsPerRow, cellsPerRowCssVar],
  );

  return React.useMemo(
    () => ({ getYearsGridProps, yearsCellRefs, yearsListOrGridContext, scrollerRef }),
    [getYearsGridProps, yearsCellRefs, yearsListOrGridContext, scrollerRef],
  );
}

export namespace useBaseCalendarYearsGrid {
  export interface PublicParameters extends useYearsCells.Parameters {
    /**
     * Cells rendered per row.
     * This is used to make sure the keyboard navigation works correctly.
     */
    cellsPerRow: number;
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface Parameters extends PublicParameters {
    /**
     * The CSS variable that must contain the number of cells per row.
     */
    cellsPerRowCssVar: string;
  }

  export interface ChildrenParameters {
    years: PickerValidDate[];
  }
}

import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeProps } from '../../base-utils/mergeProps';
import {
  applyInitialFocusInGrid,
  navigateInGrid,
  NavigateInGridChangePage,
  PageGridNavigationTarget,
} from '../../utils/base-calendar/utils/keyboardNavigation';
import { useMonthCells } from '../utils/useMonthCells';
import { useBaseCalendarRootVisibleDateContext } from '../../utils/base-calendar/root/BaseCalendarRootVisibleDateContext';

export function useCalendarMonthGrid(parameters: useCalendarMonthGrid.Parameters) {
  const {
    children,
    cellsPerRow,
    getItems,
    focusOnMount,
    canChangeYear = true,
    cellsPerRowCssVar,
  } = parameters;
  const baseRootVisibleDateContext = useBaseCalendarRootVisibleDateContext();
  const cellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { resolvedChildren, monthsListOrGridContext, changePage, scrollerRef } = useMonthCells({
    getItems,
    focusOnMount,
    children,
  });
  const pageNavigationTargetRef = React.useRef<PageGridNavigationTarget | null>(null);

  const getCellsInCalendar = useEventCallback(() => {
    const grid: HTMLElement[][] = Array.from(
      {
        length: Math.ceil(cellRefs.current.length / cellsPerRow),
      },
      () => [],
    );
    cellRefs.current.forEach((cell, index) => {
      const rowIndex = Math.floor(index / cellsPerRow);
      if (cell != null) {
        grid[rowIndex].push(cell);
      }
    });

    return [grid];
  });

  const timeout = useTimeout();
  React.useEffect(() => {
    if (pageNavigationTargetRef.current) {
      const target = pageNavigationTargetRef.current;
      timeout.start(0, () => {
        const cells = getCellsInCalendar();
        applyInitialFocusInGrid({ cells, target });
      });
    }
  }, [baseRootVisibleDateContext.visibleDate, timeout, getCellsInCalendar]);

  // TODO: Add support for multiple months grids.
  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    const changeGridPage: NavigateInGridChangePage = (params) => {
      changePage(params.direction);

      pageNavigationTargetRef.current = params.target;
    };

    navigateInGrid({
      cells: getCellsInCalendar(),
      event,
      changePage: canChangeYear ? changeGridPage : undefined,
    });
  });

  const getMonthGridProps = React.useCallback(
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
    () => ({ getMonthGridProps, cellRefs, monthsListOrGridContext, scrollerRef }),
    [getMonthGridProps, cellRefs, monthsListOrGridContext, scrollerRef],
  );
}

export namespace useCalendarMonthGrid {
  export interface PublicParameters extends useMonthCells.Parameters {
    /**
     * The number of cells per row.
     * This is used to make sure the keyboard navigation works correctly.
     */
    cellsPerRow: number;
    /**
     * Whether to go to the previous / next year
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    canChangeYear?: boolean;
  }

  export interface Parameters extends PublicParameters {
    /**
     * The CSS variable that must contain the number of cells per row.
     */
    cellsPerRowCssVar: string;
  }
}

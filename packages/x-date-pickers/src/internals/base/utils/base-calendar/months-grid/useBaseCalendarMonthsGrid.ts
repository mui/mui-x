import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import { PickerValidDate } from '../../../../../models';
import { GenericHTMLProps } from '../../../base-utils/types';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import {
  applyInitialFocusInGrid,
  navigateInGrid,
  NavigateInGridChangePage,
  PageGridNavigationTarget,
} from '../utils/keyboardNavigation';
import { useMonthsCells } from '../utils/useMonthsCells';

export function useBaseCalendarMonthsGrid(parameters: useBaseCalendarMonthsGrid.Parameters) {
  const { children, cellsPerRow, canChangeYear = true, cellsPerRowCssVar } = parameters;
  const baseRootContext = useBaseCalendarRootContext();
  const monthsCellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { months, monthsListOrGridContext, changePage } = useMonthsCells();
  const pageNavigationTargetRef = React.useRef<PageGridNavigationTarget | null>(null);

  const getCellsInCalendar = useEventCallback(() => {
    const grid: HTMLElement[][] = Array.from(
      {
        length: Math.ceil(monthsCellRefs.current.length / cellsPerRow),
      },
      () => [],
    );
    monthsCellRefs.current.forEach((cell, index) => {
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
  }, [baseRootContext.visibleDate, timeout, getCellsInCalendar]);

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

  const getMonthsGridProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'radiogroup',
        children: children == null ? null : children({ months }),
        onKeyDown,
        style: {
          [cellsPerRowCssVar]: cellsPerRow,
        },
      });
    },
    [months, children, onKeyDown, cellsPerRow, cellsPerRowCssVar],
  );

  return React.useMemo(
    () => ({ getMonthsGridProps, monthsCellRefs, monthsListOrGridContext }),
    [getMonthsGridProps, monthsCellRefs, monthsListOrGridContext],
  );
}

export namespace useBaseCalendarMonthsGrid {
  export interface PublicParameters {
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
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface Parameters extends PublicParameters {
    /**
     * The CSS variable that must contain the number of cells per row.
     */
    cellsPerRowCssVar: string;
  }

  export interface ChildrenParameters {
    months: PickerValidDate[];
  }
}

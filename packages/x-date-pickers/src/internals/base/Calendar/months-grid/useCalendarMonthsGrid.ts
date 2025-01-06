import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import { PickerValidDate } from '../../../../models';
import { useUtils } from '../../../hooks/useUtils';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';
import {
  applyInitialFocusInGrid,
  navigateInGrid,
  NavigateInGridChangePage,
  PageNavigationTarget,
} from '../utils/keyboardNavigation';
import { useCalendarMonthCellCollection } from '../utils/month-cell-collection/useCalendarMonthCellCollection';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { getFirstEnabledYear, getLastEnabledYear } from '../utils/date';

export function useCalendarMonthsGrid(parameters: useCalendarMonthsGrid.Parameters) {
  const { children, cellsPerRow } = parameters;
  const utils = useUtils();
  const calendarRootContext = useCalendarRootContext();
  const calendarMonthsCellRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { months, context } = useCalendarMonthCellCollection();
  const pageNavigationTargetRef = React.useRef<PageNavigationTarget | null>(null);

  const getCellsInCalendar = useEventCallback(() => {
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
  }, [calendarRootContext.visibleDate, timeout, getCellsInCalendar]);

  // TODO: Add support for multiple months grids.
  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    const changePage: NavigateInGridChangePage = (params) => {
      // TODO: Jump over months with no valid date.
      if (params.direction === 'previous') {
        const targetDate = utils.addYears(
          utils.startOfYear(calendarRootContext.visibleDate),
          -calendarRootContext.yearPageSize,
        );
        const lastYearInNewPage = utils.addYears(targetDate, calendarRootContext.yearPageSize - 1);

        // All the years before the visible ones are fully disabled, we skip the navigation.
        if (
          utils.isAfter(
            getFirstEnabledYear(utils, calendarRootContext.validationProps),
            lastYearInNewPage,
          )
        ) {
          return;
        }

        calendarRootContext.setVisibleDate(
          utils.addYears(calendarRootContext.visibleDate, -calendarRootContext.yearPageSize),
          false,
        );
      }
      if (params.direction === 'next') {
        const targetDate = utils.addYears(
          utils.startOfYear(calendarRootContext.visibleDate),
          calendarRootContext.yearPageSize,
        );

        // All the years after the visible ones are fully disabled, we skip the navigation.
        if (
          utils.isBefore(getLastEnabledYear(utils, calendarRootContext.validationProps), targetDate)
        ) {
          return;
        }
        calendarRootContext.setVisibleDate(
          utils.addYears(calendarRootContext.visibleDate, calendarRootContext.yearPageSize),
          false,
        );
      }

      pageNavigationTargetRef.current = params.target;
    };

    navigateInGrid({
      cells: getCellsInCalendar(),
      event,
      changePage,
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

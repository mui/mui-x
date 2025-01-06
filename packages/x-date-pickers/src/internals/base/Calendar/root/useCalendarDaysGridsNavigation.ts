import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import { PickerValidDate } from '../../../../models';
import { useUtils } from '../../../hooks/useUtils';
import type { useCalendarDaysGridBody } from '../days-grid-body/useCalendarDaysGridBody';
import {
  applyInitialFocusInGrid,
  navigateInGrid,
  NavigateInGridChangePage,
  PageNavigationTarget,
} from '../utils/keyboardNavigation';
import type { CalendarRootContext } from './CalendarRootContext';

/**
 * This logic needs to be in Calendar.Root to support multiple Calendar.DaysGrid.
 * We could introduce a Calendar.MultipleDaysGrid component that would handle this logic if we want to avoid having it in Calendar.Root.
 */
export function useCalendarDaysGridNavigation(
  parameters: useCalendarDaysGridNavigation.Parameters,
) {
  const { visibleDate, setVisibleDate, monthPageSize } = parameters;
  const utils = useUtils();
  const gridsRef = React.useRef<
    { cells: useCalendarDaysGridBody.CellsRef; rows: useCalendarDaysGridBody.RowsRef }[]
  >([]);
  const pageNavigationTargetRef = React.useRef<PageNavigationTarget | null>(null);

  const timeout = useTimeout();
  React.useEffect(() => {
    if (pageNavigationTargetRef.current) {
      const target = pageNavigationTargetRef.current;
      timeout.start(0, () => {
        applyInitialFocusInGrid({
          grids: gridsRef.current,
          target,
        });
      });
    }
  }, [visibleDate, timeout]);

  const applyDayGridKeyboardNavigation = useEventCallback((event: React.KeyboardEvent) => {
    const changePage: NavigateInGridChangePage = (params) => {
      // TODO: Jump over months with no valid date.
      if (params.direction === 'next') {
        setVisibleDate(utils.addMonths(visibleDate, monthPageSize));
      }
      if (params.direction === 'previous') {
        setVisibleDate(utils.addMonths(visibleDate, -monthPageSize));
      }

      pageNavigationTargetRef.current = params.target;
    };

    navigateInGrid({
      grids: gridsRef.current,
      target: event.target as HTMLElement,
      event,
      changePage,
    });
  });

  const registerDaysGridCells = useEventCallback(
    (
      gridCellsRef: useCalendarDaysGridBody.CellsRef,
      gridRowsRef: useCalendarDaysGridBody.RowsRef,
    ) => {
      gridsRef.current.push({ cells: gridCellsRef, rows: gridRowsRef });

      return () => {
        gridsRef.current = gridsRef.current.filter((entry) => entry.cells !== gridCellsRef);
      };
    },
  );

  return {
    registerDaysGridCells,
    applyDayGridKeyboardNavigation,
  };
}

export namespace useCalendarDaysGridNavigation {
  export interface Parameters {
    visibleDate: PickerValidDate;
    setVisibleDate: (visibleDate: PickerValidDate) => void;
    monthPageSize: number;
  }

  export interface ReturnValue
    extends Pick<CalendarRootContext, 'registerDaysGridCells' | 'applyDayGridKeyboardNavigation'> {}
}

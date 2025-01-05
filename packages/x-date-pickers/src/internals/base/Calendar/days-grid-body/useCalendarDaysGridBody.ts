import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import { PickerValidDate } from '../../../../models';
import { useUtils } from '../../../hooks/useUtils';
import { useCalendarDaysGridContext } from '../days-grid/CalendarDaysGridContext';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { GenericHTMLProps } from '../../utils/types';
import {
  applyInitialFocusInGrid,
  navigateInGrid,
  NavigateInGridChangePage,
  PageNavigationTarget,
} from '../utils/keyboardNavigation';
import { CalendarDaysGridBodyContext } from './CalendarDaysGridBodyContext';
import { useCalendarRootContext } from '../root/CalendarRootContext';

export function useCalendarDaysGridBody(parameters: useCalendarDaysGridBody.Parameters) {
  const { children } = parameters;
  const utils = useUtils();
  const calendarRootContext = useCalendarRootContext();
  const calendarDaysGridContext = useCalendarDaysGridContext();
  const calendarWeekRowRefs = React.useRef<(HTMLElement | null)[]>([]);
  const calendarWeekRowsCellsRef = React.useRef<
    {
      rowRef: React.RefObject<HTMLElement | null>;
      cellsRef: React.RefObject<(HTMLElement | null)[]>;
    }[]
  >([]);
  const pageNavigationTargetRef = React.useRef<PageNavigationTarget | null>(null);

  const timeout = useTimeout();
  React.useEffect(() => {
    if (pageNavigationTargetRef.current) {
      const target = pageNavigationTargetRef.current;
      timeout.start(0, () => {
        applyInitialFocusInGrid({
          rows: calendarWeekRowRefs.current,
          rowsCells: calendarWeekRowsCellsRef.current,
          target,
        });
      });
    }
  }, [calendarRootContext.visibleDate, timeout]);

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    const changePage: NavigateInGridChangePage = (params) => {
      if (params.direction === 'next') {
        calendarRootContext.setVisibleDate(utils.addMonths(calendarRootContext.visibleDate, 1));
      }
      if (params.direction === 'previous') {
        calendarRootContext.setVisibleDate(utils.addMonths(calendarRootContext.visibleDate, -1));
      }

      pageNavigationTargetRef.current = params.target;
    };

    navigateInGrid({
      rows: calendarWeekRowRefs.current,
      rowsCells: calendarWeekRowsCellsRef.current,
      target: event.target as HTMLElement,
      event,
      changePage,
    });
  });

  const getDaysGridBodyProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'rowgroup',
        children:
          children == null
            ? null
            : children({ weeks: calendarDaysGridContext.daysGrid.map((week) => week[0]) }),
        onKeyDown,
      });
    },
    [calendarDaysGridContext.daysGrid, children, onKeyDown],
  );

  const registerWeekRowCells = useEventCallback(
    (
      weekRowRef: React.RefObject<HTMLElement | null>,
      cellsRef: React.RefObject<(HTMLElement | null)[]>,
    ) => {
      calendarWeekRowsCellsRef.current.push({ rowRef: weekRowRef, cellsRef });

      return () => {
        calendarWeekRowsCellsRef.current = calendarWeekRowsCellsRef.current.filter(
          (entry) => entry.rowRef !== weekRowRef,
        );
      };
    },
  );

  const context: CalendarDaysGridBodyContext = React.useMemo(
    () => ({ registerWeekRowCells }),
    [registerWeekRowCells],
  );

  return React.useMemo(
    () => ({ getDaysGridBodyProps, context, calendarWeekRowRefs }),
    [getDaysGridBodyProps, context, calendarWeekRowRefs],
  );
}

export namespace useCalendarDaysGridBody {
  export interface Parameters {
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    weeks: PickerValidDate[];
  }
}

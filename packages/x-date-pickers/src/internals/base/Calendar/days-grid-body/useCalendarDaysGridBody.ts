import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { useCalendarDaysGridContext } from '../days-grid/CalendarDaysGridContext';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { GenericHTMLProps } from '../../utils/types';
import { navigateInGrid } from '../utils/keyboardNavigation';
import { CalendarDaysGridBodyContext } from './CalendarDaysGridBodyContext';

export function useCalendarDaysGridBody(parameters: useCalendarDaysGridBody.Parameters) {
  const { children } = parameters;
  const calendarDaysGridContext = useCalendarDaysGridContext();
  const calendarWeekRowRefs = React.useRef<(HTMLElement | null)[]>([]);
  const calendarWeekRowCellsRef = React.useRef<
    {
      rowRef: React.RefObject<HTMLElement | null>;
      cellsRef: React.RefObject<(HTMLElement | null)[]>;
    }[]
  >([]);

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    navigateInGrid({
      rows: calendarWeekRowRefs.current,
      cells: calendarWeekRowCellsRef.current,
      target: event.target as HTMLElement,
      event,
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
      calendarWeekRowCellsRef.current.push({ rowRef: weekRowRef, cellsRef });

      return () => {
        calendarWeekRowCellsRef.current = calendarWeekRowCellsRef.current.filter(
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

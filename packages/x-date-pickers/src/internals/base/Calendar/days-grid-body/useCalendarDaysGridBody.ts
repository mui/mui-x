import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { useCalendarDaysGridContext } from '../days-grid/CalendarDaysGridContext';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { GenericHTMLProps } from '../../utils/types';
import { CalendarDaysGridBodyContext } from './CalendarDaysGridBodyContext';
import { useCalendarRootContext } from '../root/CalendarRootContext';

export function useCalendarDaysGridBody(parameters: useCalendarDaysGridBody.Parameters) {
  const { children } = parameters;
  const rootContext = useCalendarRootContext();
  const daysGridContext = useCalendarDaysGridContext();
  const rowsRef: useCalendarDaysGridBody.RowsRef = React.useRef([]);
  const cellsRef: useCalendarDaysGridBody.CellsRef = React.useRef([]);

  const getDaysGridBodyProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'rowgroup',
        children:
          children == null
            ? null
            : children({ weeks: daysGridContext.daysGrid.map((week) => week[0]) }),
        onKeyDown: rootContext.applyDayGridKeyboardNavigation,
      });
    },
    [daysGridContext.daysGrid, rootContext.applyDayGridKeyboardNavigation, children],
  );

  const registerWeekRowCells = useEventCallback(
    (
      weekRowRef: React.RefObject<HTMLElement | null>,
      weekCellsRef: React.RefObject<(HTMLElement | null)[]>,
    ) => {
      cellsRef.current.push({ rowRef: weekRowRef, cellsRef: weekCellsRef });

      return () => {
        cellsRef.current = cellsRef.current.filter((entry) => entry.rowRef !== weekRowRef);
      };
    },
  );

  const registerDaysGridCells = rootContext.registerDaysGridCells;
  React.useEffect(() => {
    return registerDaysGridCells(cellsRef, rowsRef);
  }, [registerDaysGridCells]);

  const context: CalendarDaysGridBodyContext = React.useMemo(
    () => ({ registerWeekRowCells }),
    [registerWeekRowCells],
  );

  return React.useMemo(
    () => ({ getDaysGridBodyProps, context, calendarWeekRowRefs: rowsRef }),
    [getDaysGridBodyProps, context, rowsRef],
  );
}

export namespace useCalendarDaysGridBody {
  export interface Parameters {
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    weeks: PickerValidDate[];
  }

  export type CellsRef = React.RefObject<
    {
      rowRef: React.RefObject<HTMLElement | null>;
      cellsRef: React.RefObject<(HTMLElement | null)[]>;
    }[]
  >;

  export type RowsRef = React.RefObject<(HTMLElement | null)[]>;
}

import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../../models';
import { useBaseCalendarDaysGridContext } from '../days-grid/BaseCalendarDaysGridContext';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';
import { GenericHTMLProps } from '../../../base-utils/types';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { BaseCalendarDaysGridBodyContext } from './BaseCalendarDaysGridBodyContext';

export function useBaseCalendarDaysGridBody(parameters: useBaseCalendarDaysGridBody.Parameters) {
  const { children } = parameters;
  const baseRootContext = useBaseCalendarRootContext();
  const baseDaysGridContext = useBaseCalendarDaysGridContext();
  const rowsRef: useBaseCalendarDaysGridBody.RowsRef = React.useRef([]);
  const cellsRef: useBaseCalendarDaysGridBody.CellsRef = React.useRef([]);

  const getDaysGridBodyProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'rowgroup',
        children:
          children == null
            ? null
            : children({ weeks: baseDaysGridContext.daysGrid.map((week) => week[0]) }),
        onKeyDown: baseRootContext.applyDayGridKeyboardNavigation,
      });
    },
    [baseDaysGridContext.daysGrid, baseRootContext.applyDayGridKeyboardNavigation, children],
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

  const registerDaysGridCells = baseRootContext.registerDaysGridCells;
  React.useEffect(() => {
    return registerDaysGridCells(cellsRef, rowsRef);
  }, [registerDaysGridCells]);

  const context: BaseCalendarDaysGridBodyContext = React.useMemo(
    () => ({ registerWeekRowCells }),
    [registerWeekRowCells],
  );

  return React.useMemo(
    () => ({ getDaysGridBodyProps, context, calendarWeekRowRefs: rowsRef }),
    [getDaysGridBodyProps, context, rowsRef],
  );
}

export namespace useBaseCalendarDaysGridBody {
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

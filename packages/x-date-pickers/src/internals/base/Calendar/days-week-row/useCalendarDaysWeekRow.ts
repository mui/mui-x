import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { CalendarDaysGridContext } from '../days-grid/CalendarDaysGridContext';

export function useCalendarDaysWeekRow(parameters: useCalendarDaysWeekRow.Parameters) {
  const { children, ctx } = parameters;
  const ref = React.useRef(null);
  const calendarDayCellRefs = React.useRef<(HTMLElement | null)[]>([]);

  const getDaysWeekRowProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        ref,
        role: 'row',
        'aria-rowindex': ctx.rowIndex + 1,
        children: children == null ? null : children({ days: ctx.days }),
      });
    },
    [ctx.rowIndex, ctx.days, children],
  );

  const registerWeekRowCells = ctx.registerWeekRowCells;
  React.useEffect(() => {
    return registerWeekRowCells(ref, calendarDayCellRefs);
  }, [registerWeekRowCells]);

  return React.useMemo(
    () => ({ getDaysWeekRowProps, calendarDayCellRefs }),
    [getDaysWeekRowProps, calendarDayCellRefs],
  );
}

export namespace useCalendarDaysWeekRow {
  export interface Parameters {
    value: PickerValidDate;
    ctx: useCalendarDaysWeekRow.Context;
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    days: PickerValidDate[];
  }

  export interface Context extends Pick<CalendarDaysGridContext, 'registerWeekRowCells'> {
    days: PickerValidDate[];
    rowIndex: number;
  }
}

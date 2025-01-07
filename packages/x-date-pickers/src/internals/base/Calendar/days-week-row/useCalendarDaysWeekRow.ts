import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../base-utils/types';
import { mergeReactProps } from '../../base-utils/mergeReactProps';
import { CalendarDaysGridBodyContext } from '../../utils/base-calendar/days-grid-body/BaseCalendarDaysGridBodyContext';

export function useCalendarDaysWeekRow(parameters: useCalendarDaysWeekRow.Parameters) {
  const { children, ctx } = parameters;
  const ref = React.useRef(null);
  const dayCellRefs = React.useRef<(HTMLElement | null)[]>([]);

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
    return registerWeekRowCells(ref, dayCellRefs);
  }, [registerWeekRowCells]);

  return React.useMemo(
    () => ({ getDaysWeekRowProps, dayCellRefs }),
    [getDaysWeekRowProps, dayCellRefs],
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

  export interface Context extends Pick<CalendarDaysGridBodyContext, 'registerWeekRowCells'> {
    days: PickerValidDate[];
    rowIndex: number;
  }
}

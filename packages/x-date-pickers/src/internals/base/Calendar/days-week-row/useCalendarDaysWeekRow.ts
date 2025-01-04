import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';

export function useCalendarDaysWeekRow(parameters: useCalendarDaysWeekRow.Parameters) {
  const { children, ctx } = parameters;

  const getDaysWeekRowProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'row',
        'aria-rowindex': ctx.rowIndex + 1,
        children: children == null ? null : children({ days: ctx.days }),
      });
    },
    [ctx.rowIndex, ctx.days, children],
  );

  return React.useMemo(() => ({ getDaysWeekRowProps }), [getDaysWeekRowProps]);
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

  export interface Context {
    days: PickerValidDate[];
    rowIndex: number;
  }
}

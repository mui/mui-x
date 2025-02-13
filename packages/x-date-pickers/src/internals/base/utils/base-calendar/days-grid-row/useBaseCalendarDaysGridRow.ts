import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { GenericHTMLProps } from '../../../base-utils/types';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';
import { BaseCalendarDaysGridRowContext } from './BaseCalendarDaysGridRowContext';

export function useBaseCalendarDaysGridRow(parameters: useBaseCalendarDaysGridRow.Parameters) {
  const { children, ctx } = parameters;
  const ref = React.useRef<HTMLDivElement>(null);

  const getDaysGridRowProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        ref,
        role: 'row',
        'aria-rowindex': ctx.rowIndex + 1,
        children: children == null ? null : children({ days: ctx.days }),
      });
    },
    [ctx.days, ctx.rowIndex, children],
  );

  const context: BaseCalendarDaysGridRowContext = React.useMemo(() => ({ ref }), [ref]);

  return React.useMemo(() => ({ getDaysGridRowProps, context }), [getDaysGridRowProps, context]);
}

export namespace useBaseCalendarDaysGridRow {
  export interface Parameters {
    /**
     * The date object representing the week.
     */
    value: PickerValidDate;
    /**
     * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
     */
    ctx: Context;
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    /**
     * The days of the week.
     */
    days: PickerValidDate[];
  }

  export interface Context {
    days: PickerValidDate[];
    /**
     * The index of the row in the grid.
     */
    rowIndex: number;
  }
}

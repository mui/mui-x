import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { GenericHTMLProps } from '../../../base-utils/types';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';
import { BaseCalendarDayGridRowContext } from './BaseCalendarDayGridRowContext';

export function useBaseCalendarDayGridRow(parameters: useBaseCalendarDayGridRow.Parameters) {
  const { children, ctx } = parameters;
  const ref = React.useRef<HTMLDivElement>(null);

  const resolvedChildren = React.useMemo(() => {
    if (!React.isValidElement(children) && typeof children === 'function') {
      return children({ days: ctx.days });
    }

    return children;
  }, [children, ctx.days]);

  const getDayGridRowProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        ref,
        role: 'row',
        'aria-rowindex': ctx.rowIndex + 1,
        children: resolvedChildren,
      });
    },
    [ctx.rowIndex, resolvedChildren],
  );

  const context: BaseCalendarDayGridRowContext = React.useMemo(() => ({ ref }), [ref]);

  return React.useMemo(() => ({ getDayGridRowProps, context }), [getDayGridRowProps, context]);
}

export namespace useBaseCalendarDayGridRow {
  export interface Parameters {
    /**
     * The date object representing the week.
     */
    value: PickerValidDate;
    /**
     * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
     */
    ctx: Context;
    /**
     * The children of the component.
     * If a function is provided, it will be called with the days to render as its parameter.
     */
    children?: React.ReactNode | ((parameters: ChildrenParameters) => React.ReactNode);
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

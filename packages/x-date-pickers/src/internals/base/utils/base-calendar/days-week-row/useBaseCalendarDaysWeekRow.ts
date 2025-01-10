import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { GenericHTMLProps } from '../../../base-utils/types';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';
import { BaseCalendarDaysGridBodyContext } from '../days-grid-body/BaseCalendarDaysGridBodyContext';

export function useBaseCalendarDaysWeekRow(parameters: useBaseCalendarDaysWeekRow.Parameters) {
  const { children, ctx } = parameters;
  const ref = React.useRef(null);
  const cellRefs = React.useRef<(HTMLElement | null)[]>([]);

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
    return registerWeekRowCells(ref, cellRefs);
  }, [registerWeekRowCells]);

  return React.useMemo(() => ({ getDaysWeekRowProps, cellRefs }), [getDaysWeekRowProps, cellRefs]);
}

export namespace useBaseCalendarDaysWeekRow {
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
    days: PickerValidDate[];
  }

  export interface Context extends Pick<BaseCalendarDaysGridBodyContext, 'registerWeekRowCells'> {
    days: PickerValidDate[];
    rowIndex: number;
  }
}

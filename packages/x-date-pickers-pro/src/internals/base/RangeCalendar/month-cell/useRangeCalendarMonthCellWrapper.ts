import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarMonthCellWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/month-cell/useBaseCalendarMonthCellWrapper';
import type { useRangeCalendarMonthCell } from './useRangeCalendarMonthCell';
import { useRangeCellWrapper } from '../utils/useRangeCellWrapper';

export function useRangeCalendarMonthCellWrapper(
  parameters: useRangeCalendarMonthCellWrapper.Parameters,
): useRangeCalendarMonthCellWrapper.ReturnValue {
  const { value } = parameters;
  const { ref: baseRef, ctx: baseCtx } = useBaseCalendarMonthCellWrapper(parameters);
  const { cellRef, ctx: rangeCellCtx } = useRangeCellWrapper({ value, section: 'month' });
  const ref = useForkRef(baseRef, cellRef);

  const ctx = React.useMemo<useRangeCalendarMonthCell.Context>(
    () => ({
      ...baseCtx,
      ...rangeCellCtx,
    }),
    [baseCtx, rangeCellCtx],
  );

  return { ref, ctx };
}

export namespace useRangeCalendarMonthCellWrapper {
  export interface Parameters extends useBaseCalendarMonthCellWrapper.Parameters {}

  export interface ReturnValue extends Omit<useBaseCalendarMonthCellWrapper.ReturnValue, 'ctx'> {
    /**
     * The memoized context to forward to the memoized component so that it does not need to subscribe to any context.
     */
    ctx: useRangeCalendarMonthCell.Context;
  }
}

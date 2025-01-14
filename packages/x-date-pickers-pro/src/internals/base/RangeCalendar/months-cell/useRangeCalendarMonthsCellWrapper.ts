import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarMonthsCellWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/months-cell/useBaseCalendarMonthsCellWrapper';
import type { useRangeCalendarMonthsCell } from './useRangeCalendarMonthsCell';
import { useRangeCellWrapper } from '../utils/useRangeCellWrapper';

export function useRangeCalendarMonthsCellWrapper(
  parameters: useRangeCalendarMonthsCellWrapper.Parameters,
): useRangeCalendarMonthsCellWrapper.ReturnValue {
  const { value } = parameters;
  const { ref: baseRef, ctx: baseCtx } = useBaseCalendarMonthsCellWrapper(parameters);
  const { cellRef, ctx: rangeCellCtx } = useRangeCellWrapper({ value, section: 'day' });
  const ref = useForkRef(baseRef, cellRef);

  const ctx = React.useMemo<useRangeCalendarMonthsCell.Context>(
    () => ({
      ...baseCtx,
      ...rangeCellCtx,
    }),
    [baseCtx, rangeCellCtx],
  );

  return { ref, ctx };
}

export namespace useRangeCalendarMonthsCellWrapper {
  export interface Parameters extends useBaseCalendarMonthsCellWrapper.Parameters {}

  export interface ReturnValue extends Omit<useBaseCalendarMonthsCellWrapper.ReturnValue, 'ctx'> {
    /**
     * The memoized context to forward to the memoized component so that it does not need to subscribe to any context.
     */
    ctx: useRangeCalendarMonthsCell.Context;
  }
}

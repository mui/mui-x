import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDayCellWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-cell/useBaseCalendarDayCellWrapper';
import type { useRangeCalendarDayCell } from './useRangeCalendarDayCell';
import { useRangeCellWrapper } from '../utils/useRangeCellWrapper';

export function useRangeCalendarDayCellWrapper(
  parameters: useRangeCalendarDayCellWrapper.Parameters,
): useRangeCalendarDayCellWrapper.ReturnValue {
  const { value } = parameters;
  const { ref: baseRef, ctx: baseCtx } = useBaseCalendarDayCellWrapper(parameters);
  const { cellRef, ctx: rangeCellCtx } = useRangeCellWrapper({ value, section: 'day' });
  const ref = useForkRef(baseRef, cellRef);

  const ctx = React.useMemo<useRangeCalendarDayCell.Context>(
    () => ({
      ...baseCtx,
      ...rangeCellCtx,
    }),
    [baseCtx, rangeCellCtx],
  );

  return { ref, ctx };
}

export namespace useRangeCalendarDayCellWrapper {
  export interface Parameters extends useBaseCalendarDayCellWrapper.Parameters {}

  export interface ReturnValue extends Omit<useBaseCalendarDayCellWrapper.ReturnValue, 'ctx'> {
    /**
     * The memoized context to forward to the memoized component so that it does not need to subscribe to any context.
     */
    ctx: useRangeCalendarDayCell.Context;
  }
}

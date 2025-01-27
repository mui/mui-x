import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysCellWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-cell/useBaseCalendarDaysCellWrapper';
import type { useRangeCalendarDaysCell } from './useRangeCalendarDaysCell';
import { useRangeCellWrapper } from '../utils/useRangeCellWrapper';

export function useRangeCalendarDaysCellWrapper(
  parameters: useRangeCalendarDaysCellWrapper.Parameters,
): useRangeCalendarDaysCellWrapper.ReturnValue {
  const { value } = parameters;
  const { ref: baseRef, ctx: baseCtx } = useBaseCalendarDaysCellWrapper(parameters);
  const { cellRef, ctx: rangeCellCtx } = useRangeCellWrapper({ value, section: 'day' });
  const ref = useForkRef(baseRef, cellRef);

  const ctx = React.useMemo<useRangeCalendarDaysCell.Context>(
    () => ({
      ...baseCtx,
      ...rangeCellCtx,
    }),
    [baseCtx, rangeCellCtx],
  );

  return { ref, ctx };
}

export namespace useRangeCalendarDaysCellWrapper {
  export interface Parameters extends useBaseCalendarDaysCellWrapper.Parameters {}

  export interface ReturnValue extends Omit<useBaseCalendarDaysCellWrapper.ReturnValue, 'ctx'> {
    /**
     * The memoized context to forward to the memoized component so that it does not need to subscribe to any context.
     */
    ctx: useRangeCalendarDaysCell.Context;
  }
}

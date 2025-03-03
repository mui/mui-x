import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarYearCellWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/year-cell/useBaseCalendarYearCellWrapper';
import type { useRangeCalendarYearCell } from './useRangeCalendarYearCell';
import { useRangeCellWrapper } from '../utils/useRangeCellWrapper';

export function useRangeCalendarYearCellWrapper(
  parameters: useRangeCalendarYearCellWrapper.Parameters,
): useRangeCalendarYearCellWrapper.ReturnValue {
  const { value } = parameters;
  const { ref: baseRef, ctx: baseCtx } = useBaseCalendarYearCellWrapper(parameters);
  const { cellRef, ctx: rangeCellCtx } = useRangeCellWrapper({ value, section: 'year' });
  const ref = useForkRef(baseRef, cellRef);

  const ctx = React.useMemo<useRangeCalendarYearCell.Context>(
    () => ({
      ...baseCtx,
      ...rangeCellCtx,
    }),
    [baseCtx, rangeCellCtx],
  );

  return { ref, ctx };
}

export namespace useRangeCalendarYearCellWrapper {
  export interface Parameters extends useBaseCalendarYearCellWrapper.Parameters {}

  export interface ReturnValue extends Omit<useBaseCalendarYearCellWrapper.ReturnValue, 'ctx'> {
    /**
     * The memoized context to forward to the memoized component so that it does not need to subscribe to any context.
     */
    ctx: useRangeCalendarYearCell.Context;
  }
}

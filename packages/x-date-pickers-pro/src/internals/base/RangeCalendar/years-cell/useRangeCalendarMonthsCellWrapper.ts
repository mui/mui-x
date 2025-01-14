import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarYearsCellWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/years-cell/useBaseCalendarYearsCellWrapper';
import type { useRangeCalendarYearsCell } from './useRangeCalendarYearsCell';
import { useRangeCellWrapper } from '../utils/useRangeCellWrapper';

export function useRangeCalendarYearsCellWrapper(
  parameters: useRangeCalendarYearsCellWrapper.Parameters,
): useRangeCalendarYearsCellWrapper.ReturnValue {
  const { value } = parameters;
  const { ref: baseRef, ctx: baseCtx } = useBaseCalendarYearsCellWrapper(parameters);
  const { cellRef, ctx: rangeCellCtx } = useRangeCellWrapper({ value, section: 'year' });
  const ref = useForkRef(baseRef, cellRef);

  const ctx = React.useMemo<useRangeCalendarYearsCell.Context>(
    () => ({
      ...baseCtx,
      ...rangeCellCtx,
    }),
    [baseCtx, rangeCellCtx],
  );

  return { ref, ctx };
}

export namespace useRangeCalendarYearsCellWrapper {
  export interface Parameters extends useBaseCalendarYearsCellWrapper.Parameters {}

  export interface ReturnValue extends Omit<useBaseCalendarYearsCellWrapper.ReturnValue, 'ctx'> {
    /**
     * The memoized context to forward to the memoized component so that it does not need to subscribe to any context.
     */
    ctx: useRangeCalendarYearsCell.Context;
  }
}

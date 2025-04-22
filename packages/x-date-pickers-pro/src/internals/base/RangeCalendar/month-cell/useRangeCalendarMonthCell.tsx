import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarMonthCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/month-cell/useBaseCalendarMonthCell';
// eslint-disable-next-line no-restricted-imports
import { mergeProps } from '@mui/x-date-pickers/internals/base/base-utils/mergeProps';
import { useRangeCell } from '../utils/useRangeCell';

export function useRangeCalendarMonthCell(parameters: useRangeCalendarMonthCell.Parameters) {
  const { ctx, value } = parameters;
  const { getMonthCellProps: getBaseMonthCellProps } = useBaseCalendarMonthCell(parameters);
  const rangeCellProps = useRangeCell({ ctx, value, section: 'month' });

  const getMonthCellProps = React.useCallback(
    (externalProps = {}): React.ComponentPropsWithRef<'button'> => {
      return mergeProps(getBaseMonthCellProps(externalProps), rangeCellProps, externalProps);
    },
    [rangeCellProps, getBaseMonthCellProps],
  );

  return React.useMemo(() => ({ getMonthCellProps }), [getMonthCellProps]);
}

export namespace useRangeCalendarMonthCell {
  export interface Parameters extends useBaseCalendarMonthCell.Parameters {
    /**
     * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
     */
    ctx: Context;
  }

  export interface Context extends useBaseCalendarMonthCell.Context, useRangeCell.Context {}
}

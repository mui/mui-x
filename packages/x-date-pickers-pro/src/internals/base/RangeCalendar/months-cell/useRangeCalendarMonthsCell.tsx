import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarMonthsCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/months-cell/useBaseCalendarMonthsCell';
// eslint-disable-next-line no-restricted-imports
import { GenericHTMLProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { mergeReactProps } from '@mui/x-date-pickers/internals/base/base-utils/mergeReactProps';
import { useRangeCell } from '../utils/useRangeCell';

export function useRangeCalendarMonthsCell(parameters: useRangeCalendarMonthsCell.Parameters) {
  const { ctx, value } = parameters;
  const rangeCellProps = useRangeCell({ ctx, value, section: 'month' });

  const { getMonthsCellProps: getBaseMonthsCellProps, isCurrent } =
    useBaseCalendarMonthsCell(parameters);

  const getMonthsCellProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, rangeCellProps, getBaseMonthsCellProps(externalProps));
    },
    [rangeCellProps, getBaseMonthsCellProps],
  );

  return React.useMemo(() => ({ getMonthsCellProps, isCurrent }), [getMonthsCellProps, isCurrent]);
}

export namespace useRangeCalendarMonthsCell {
  export interface Parameters extends useBaseCalendarMonthsCell.Parameters {
    /**
     * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
     */
    ctx: Context;
  }

  export interface Context extends useBaseCalendarMonthsCell.Context, useRangeCell.Context {}
}

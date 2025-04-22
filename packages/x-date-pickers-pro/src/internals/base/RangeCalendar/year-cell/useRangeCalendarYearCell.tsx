import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarYearCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/year-cell/useBaseCalendarYearCell';
// eslint-disable-next-line no-restricted-imports
import { mergeProps } from '@mui/x-date-pickers/internals/base/base-utils/mergeProps';
import { useRangeCell } from '../utils/useRangeCell';

export function useRangeCalendarYearCell(parameters: useRangeCalendarYearCell.Parameters) {
  const { ctx, value } = parameters;
  const { getYearCellProps: getBaseYearCellProps } = useBaseCalendarYearCell(parameters);
  const rangeCellProps = useRangeCell({ ctx, value, section: 'year' });

  const getYearCellProps = React.useCallback(
    (externalProps = {}): React.ComponentPropsWithRef<'button'> => {
      return mergeProps(getBaseYearCellProps(externalProps), rangeCellProps, externalProps);
    },
    [rangeCellProps, getBaseYearCellProps],
  );

  return React.useMemo(() => ({ getYearCellProps }), [getYearCellProps]);
}

export namespace useRangeCalendarYearCell {
  export interface Parameters extends useBaseCalendarYearCell.Parameters {
    /**
     * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
     */
    ctx: Context;
  }

  export interface Context extends useBaseCalendarYearCell.Context, useRangeCell.Context {}
}

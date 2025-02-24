import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarYearCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/year-cell/useBaseCalendarYearCell';
// eslint-disable-next-line no-restricted-imports
import { GenericHTMLProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { mergeReactProps } from '@mui/x-date-pickers/internals/base/base-utils/mergeReactProps';
import { useRangeCell } from '../utils/useRangeCell';

export function useRangeCalendarYearCell(parameters: useRangeCalendarYearCell.Parameters) {
  const { ctx, value } = parameters;
  const { getYearCellProps: getBaseYearCellProps } = useBaseCalendarYearCell(parameters);
  const rangeCellProps = useRangeCell({ ctx, value, section: 'year' });

  const getYearCellProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, rangeCellProps, getBaseYearCellProps(externalProps));
    },
    [rangeCellProps, getBaseYearCellProps],
  );

  return React.useMemo(() => ({ getYearCellProps }), [getYearCellProps]);
}

namespace useRangeCalendarYearCell {
  export interface Parameters extends useBaseCalendarYearCell.Parameters {
    /**
     * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
     */
    ctx: Context;
  }

  export interface Context extends useBaseCalendarYearCell.Context, useRangeCell.Context {}
}

import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarYearsCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/years-cell/useBaseCalendarYearsCell';
// eslint-disable-next-line no-restricted-imports
import { GenericHTMLProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { mergeReactProps } from '@mui/x-date-pickers/internals/base/base-utils/mergeReactProps';
import { useRangeCell } from '../utils/useRangeCell';

export function useRangeCalendarYearsCell(parameters: useRangeCalendarYearsCell.Parameters) {
  const { ctx, value } = parameters;
  const { getYearsCellProps: getBaseYearsCellProps } = useBaseCalendarYearsCell(parameters);
  const rangeCellProps = useRangeCell({ ctx, value, section: 'year' });

  const getYearsCellProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, rangeCellProps, getBaseYearsCellProps(externalProps));
    },
    [rangeCellProps, getBaseYearsCellProps],
  );

  return React.useMemo(() => ({ getYearsCellProps }), [getYearsCellProps]);
}

export namespace useRangeCalendarYearsCell {
  export interface Parameters extends useBaseCalendarYearsCell.Parameters {
    /**
     * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
     */
    ctx: Context;
  }

  export interface Context extends useBaseCalendarYearsCell.Context, useRangeCell.Context {}
}

import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-cell/useBaseCalendarDaysCell';
// eslint-disable-next-line no-restricted-imports
import { GenericHTMLProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { mergeReactProps } from '@mui/x-date-pickers/internals/base/base-utils/mergeReactProps';
import { useRangeCell } from '../utils/useRangeCell';

export function useRangeCalendarDaysCell(parameters: useRangeCalendarDaysCell.Parameters) {
  const { ctx, value } = parameters;
  const { getDaysCellProps: getBaseDaysCellProps } = useBaseCalendarDaysCell(parameters);
  const rangeCellProps = useRangeCell({ ctx, value, section: 'day' });

  const getDaysCellProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, rangeCellProps, getBaseDaysCellProps(externalProps));
    },
    [rangeCellProps, getBaseDaysCellProps],
  );

  return React.useMemo(() => ({ getDaysCellProps }), [getDaysCellProps]);
}

export namespace useRangeCalendarDaysCell {
  export interface Parameters extends useBaseCalendarDaysCell.Parameters {
    /**
     * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
     */
    ctx: Context;
  }

  export interface Context extends useBaseCalendarDaysCell.Context, useRangeCell.Context {}
}

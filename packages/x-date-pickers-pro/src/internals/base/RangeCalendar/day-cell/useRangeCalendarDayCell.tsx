import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDayCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-cell/useBaseCalendarDayCell';
// eslint-disable-next-line no-restricted-imports
import { mergeProps } from '@mui/x-date-pickers/internals/base/base-utils/mergeProps';
import { useRangeCell } from '../utils/useRangeCell';

export function useRangeCalendarDayCell(parameters: useRangeCalendarDayCell.Parameters) {
  const { ctx, value } = parameters;
  const { getDayCellProps: getBaseDayCellProps } = useBaseCalendarDayCell(parameters);
  const rangeCellProps = useRangeCell({ ctx, value, section: 'day' });

  const getDayCellProps = React.useCallback(
    (externalProps = {}): React.ComponentPropsWithRef<'button'> => {
      return mergeProps(rangeCellProps, getBaseDayCellProps(externalProps), externalProps);
    },
    [rangeCellProps, getBaseDayCellProps],
  );

  return React.useMemo(() => ({ getDayCellProps }), [getDayCellProps]);
}

export namespace useRangeCalendarDayCell {
  export interface Parameters extends useBaseCalendarDayCell.Parameters {
    /**
     * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
     */
    ctx: Context;
  }

  export interface Context extends useBaseCalendarDayCell.Context, useRangeCell.Context {}
}

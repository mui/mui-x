import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
// eslint-disable-next-line no-restricted-imports
import { mergeProps } from '@mui/x-date-pickers/internals/base/base-utils/mergeProps';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDayGridBody } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-grid-body/useBaseCalendarDayGridBody';
import { useRangeCalendarRootContext } from '../root/RangeCalendarRootContext';

export function useRangeCalendarDayGridBody(parameters: useRangeCalendarDayGridBody.Parameters) {
  const { getDayGridBodyProps: getBaseDayGridBodyProps, ...rest } =
    useBaseCalendarDayGridBody(parameters);

  const rootContext = useRangeCalendarRootContext();

  // TODO: Add the same of year and month list and year.
  const onMouseLeave = useEventCallback(() => {
    rootContext.setHoveredDate(null, 'day');
  });

  const getDayGridBodyProps = React.useCallback(
    (externalProps = {}): React.ComponentPropsWithRef<'div'> => {
      return mergeProps(
        getBaseDayGridBodyProps(externalProps),
        {
          onMouseLeave,
        },
        externalProps,
      );
    },
    [getBaseDayGridBodyProps, onMouseLeave],
  );

  return { getDayGridBodyProps, ...rest };
}

export namespace useRangeCalendarDayGridBody {
  export interface Parameters extends useBaseCalendarDayGridBody.Parameters {}
}

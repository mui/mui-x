import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
// eslint-disable-next-line no-restricted-imports
import { mergeReactProps } from '@mui/x-date-pickers/internals/base/base-utils/mergeReactProps';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDayGridBody } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-grid-body/useBaseCalendarDayGridBody';
// eslint-disable-next-line no-restricted-imports
import { GenericHTMLProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
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
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, getBaseDayGridBodyProps(externalProps), {
        onMouseLeave,
      });
    },
    [getBaseDayGridBodyProps, onMouseLeave],
  );

  return { getDayGridBodyProps, ...rest };
}

namespace useRangeCalendarDayGridBody {
  export interface Parameters extends useBaseCalendarDayGridBody.Parameters {}
}

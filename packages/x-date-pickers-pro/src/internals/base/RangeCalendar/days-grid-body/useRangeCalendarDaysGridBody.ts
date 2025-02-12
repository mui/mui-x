import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
// eslint-disable-next-line no-restricted-imports
import { mergeReactProps } from '@mui/x-date-pickers/internals/base/base-utils/mergeReactProps';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysGridBody } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-grid-body/useBaseCalendarDaysGridBody';
// eslint-disable-next-line no-restricted-imports
import { GenericHTMLProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
import { useRangeCalendarRootContext } from '../root/RangeCalendarRootContext';

export function useRangeCalendarDaysGridBody(parameters: useRangeCalendarDaysGridBody.Parameters) {
  const { getDaysGridBodyProps: getBaseDaysGridBodyProps, context } =
    useBaseCalendarDaysGridBody(parameters);

  const rootContext = useRangeCalendarRootContext();

  // TODO: Add the same of year and month list and year.
  const onMouseLeave = useEventCallback(() => {
    rootContext.setHoveredDate(null, 'day');
  });

  const getDaysGridBodyProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, getBaseDaysGridBodyProps(externalProps), {
        onMouseLeave,
      });
    },
    [getBaseDaysGridBodyProps, onMouseLeave],
  );

  return { context, getDaysGridBodyProps };
}

export namespace useRangeCalendarDaysGridBody {
  export interface Parameters extends useBaseCalendarDaysGridBody.Parameters {}
}

import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { getWeekdays } from '../../../utils/date-utils';
import { useUtils } from '../../../hooks/useUtils';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';

export function useCalendarDaysGridHeader(parameters: useCalendarDaysGridHeader.Parameters) {
  const { children } = parameters;
  const utils = useUtils();
  const calendarRootContext = useCalendarRootContext();

  const days = React.useMemo(
    () => getWeekdays(utils, calendarRootContext.value ?? calendarRootContext.referenceDate),
    [utils, calendarRootContext.value, calendarRootContext.referenceDate],
  );

  const getDaysGridHeaderProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'row',
        children: children == null ? null : children({ days }),
      });
    },
    [days, children],
  );

  return React.useMemo(() => ({ getDaysGridHeaderProps }), [getDaysGridHeaderProps]);
}

export namespace useCalendarDaysGridHeader {
  export interface Parameters {
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    days: PickerValidDate[];
  }
}

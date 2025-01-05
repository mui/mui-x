import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { findClosestEnabledDate, getMonthsInYear } from '../../../utils/date-utils';
import { useUtils } from '../../../hooks/useUtils';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { CalendarMonthsListContext } from './CalendarMonthsListContext';
import { navigateInList } from '../utils/keyboardNavigation';

export function useCalendarMonthsList(parameters: useCalendarMonthsList.Parameters) {
  const { children, loop = true } = parameters;
  const utils = useUtils();
  const calendarRootContext = useCalendarRootContext();
  const calendarMonthsCellRefs = React.useRef<(HTMLElement | null)[]>([]);

  const months = React.useMemo(
    () => getMonthsInYear(utils, calendarRootContext.value ?? calendarRootContext.referenceDate),
    [utils, calendarRootContext.value, calendarRootContext.referenceDate],
  );

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    navigateInList({
      cells: calendarMonthsCellRefs.current,
      target: event.target as HTMLElement,
      key: event.key,
      loop,
    });
  });

  const getMonthListProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'radiogroup',
        children: children == null ? null : children({ months }),
        onKeyDown,
      });
    },
    [months, children, onKeyDown],
  );

  const selectMonth = useEventCallback((newValue: PickerValidDate) => {
    if (calendarRootContext.readOnly) {
      return;
    }

    const newCleanValue = utils.setMonth(
      calendarRootContext.value ?? calendarRootContext.referenceDate,
      utils.getMonth(newValue),
    );

    const startOfMonth = utils.startOfMonth(newCleanValue);
    const endOfMonth = utils.endOfMonth(newCleanValue);

    const closestEnabledDate = calendarRootContext.isDateDisabled(newCleanValue)
      ? findClosestEnabledDate({
          utils,
          date: newCleanValue,
          minDate: utils.isBefore(calendarRootContext.validationProps.minDate, startOfMonth)
            ? startOfMonth
            : calendarRootContext.validationProps.minDate,
          maxDate: utils.isAfter(calendarRootContext.validationProps.maxDate, endOfMonth)
            ? endOfMonth
            : calendarRootContext.validationProps.maxDate,
          disablePast: calendarRootContext.validationProps.disablePast,
          disableFuture: calendarRootContext.validationProps.disableFuture,
          isDateDisabled: calendarRootContext.isDateDisabled,
          timezone: calendarRootContext.timezone,
        })
      : newCleanValue;

    if (closestEnabledDate) {
      calendarRootContext.setValue(newCleanValue, { section: 'month' });
    }
  });

  const context: CalendarMonthsListContext = React.useMemo(() => ({ selectMonth }), [selectMonth]);

  return React.useMemo(
    () => ({ getMonthListProps, context, calendarMonthsCellRefs }),
    [getMonthListProps, context, calendarMonthsCellRefs],
  );
}

export namespace useCalendarMonthsList {
  export interface Parameters {
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    loop?: boolean;
    children?: (parameters: ChildrenParameters) => React.ReactNode;
  }

  export interface ChildrenParameters {
    months: PickerValidDate[];
  }
}

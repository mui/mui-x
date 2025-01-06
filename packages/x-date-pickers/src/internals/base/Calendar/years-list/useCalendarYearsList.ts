import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { findClosestEnabledDate } from '../../../utils/date-utils';
import { useUtils } from '../../../hooks/useUtils';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { CalendarYearsListContext } from './CalendarYearsListContext';
import { navigateInList } from '../utils/keyboardNavigation';

export function useCalendarYearsList(parameters: useCalendarYearsList.Parameters) {
  const { children, loop = true } = parameters;
  const utils = useUtils();
  const calendarRootContext = useCalendarRootContext();
  const calendarYearsCellRefs = React.useRef<(HTMLElement | null)[]>([]);

  const years = React.useMemo(
    () =>
      utils.getYearRange([
        calendarRootContext.validationProps.minDate,
        calendarRootContext.validationProps.maxDate,
      ]),
    [
      utils,
      calendarRootContext.validationProps.minDate,
      calendarRootContext.validationProps.maxDate,
    ],
  );

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    navigateInList({
      cells: calendarYearsCellRefs.current,
      event,
      loop,
    });
  });

  const getYearListProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        role: 'radiogroup',
        children: children == null ? null : children({ years }),
        onKeyDown,
      });
    },
    [years, children, onKeyDown],
  );

  const selectYear = useEventCallback((newValue: PickerValidDate) => {
    if (calendarRootContext.readOnly) {
      return;
    }

    const newCleanValue = utils.setYear(
      calendarRootContext.value ?? calendarRootContext.referenceDate,
      utils.getYear(newValue),
    );

    const startOfYear = utils.startOfYear(newCleanValue);
    const endOfYear = utils.endOfYear(newCleanValue);

    const closestEnabledDate = calendarRootContext.isDateDisabled(newCleanValue)
      ? findClosestEnabledDate({
          utils,
          date: newCleanValue,
          minDate: utils.isBefore(calendarRootContext.validationProps.minDate, startOfYear)
            ? startOfYear
            : calendarRootContext.validationProps.minDate,
          maxDate: utils.isAfter(calendarRootContext.validationProps.maxDate, endOfYear)
            ? endOfYear
            : calendarRootContext.validationProps.maxDate,
          disablePast: calendarRootContext.validationProps.disablePast,
          disableFuture: calendarRootContext.validationProps.disableFuture,
          isDateDisabled: calendarRootContext.isDateDisabled,
          timezone: calendarRootContext.timezone,
        })
      : newCleanValue;

    if (closestEnabledDate) {
      calendarRootContext.setValue(closestEnabledDate, { section: 'year' });
    }
  });

  const registerSection = calendarRootContext.registerSection;
  React.useEffect(() => {
    return registerSection({ type: 'month', value: calendarRootContext.visibleDate });
  }, [registerSection, calendarRootContext.visibleDate]);

  const context: CalendarYearsListContext = React.useMemo(() => ({ selectYear }), [selectYear]);

  return React.useMemo(
    () => ({ getYearListProps, context, calendarYearsCellRefs }),
    [getYearListProps, context, calendarYearsCellRefs],
  );
}

export namespace useCalendarYearsList {
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
    years: PickerValidDate[];
  }
}

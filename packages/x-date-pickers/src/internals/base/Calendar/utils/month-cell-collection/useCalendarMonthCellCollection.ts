import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../../models';
import { findClosestEnabledDate, getMonthsInYear } from '../../../../utils/date-utils';
import { useUtils } from '../../../../hooks/useUtils';
import { useCalendarRootContext } from '../../root/CalendarRootContext';
import { CalendarMonthCellCollectionContext } from './CalendarMonthCellCollectionContext';

export function useCalendarMonthCellCollection() {
  const calendarRootContext = useCalendarRootContext();
  const utils = useUtils();

  const currentYear = React.useMemo(
    () => utils.startOfYear(calendarRootContext.visibleDate),
    [utils, calendarRootContext.visibleDate],
  );

  const months = React.useMemo(() => getMonthsInYear(utils, currentYear), [utils, currentYear]);

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
      calendarRootContext.setVisibleDate(closestEnabledDate, true);
      calendarRootContext.setValue(closestEnabledDate, { section: 'month' });
    }
  });

  const registerSection = calendarRootContext.registerSection;
  React.useEffect(() => {
    return registerSection({ type: 'month', value: currentYear });
  }, [registerSection, currentYear]);

  const context: CalendarMonthCellCollectionContext = React.useMemo(
    () => ({ selectMonth }),
    [selectMonth],
  );

  return { months, context };
}

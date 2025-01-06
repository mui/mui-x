import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../../models';
import { findClosestEnabledDate, getMonthsInYear } from '../../../../utils/date-utils';
import { useUtils } from '../../../../hooks/useUtils';
import { useCalendarRootContext } from '../../root/CalendarRootContext';
import { CalendarMonthsCellCollectionContext } from './CalendarMonthsCellCollectionContext';

export function useCalendarMonthsCellCollection(): useCalendarMonthsCellCollection.ReturnValue {
  const rootContext = useCalendarRootContext();
  const utils = useUtils();

  const currentYear = React.useMemo(
    () => utils.startOfYear(rootContext.visibleDate),
    [utils, rootContext.visibleDate],
  );

  const months = React.useMemo(() => getMonthsInYear(utils, currentYear), [utils, currentYear]);

  const selectMonth = useEventCallback((newValue: PickerValidDate) => {
    if (rootContext.readOnly) {
      return;
    }

    const newCleanValue = utils.setMonth(
      rootContext.value ?? rootContext.referenceDate,
      utils.getMonth(newValue),
    );

    const startOfMonth = utils.startOfMonth(newCleanValue);
    const endOfMonth = utils.endOfMonth(newCleanValue);

    const closestEnabledDate = rootContext.isDateDisabled(newCleanValue)
      ? findClosestEnabledDate({
          utils,
          date: newCleanValue,
          minDate: utils.isBefore(rootContext.validationProps.minDate, startOfMonth)
            ? startOfMonth
            : rootContext.validationProps.minDate,
          maxDate: utils.isAfter(rootContext.validationProps.maxDate, endOfMonth)
            ? endOfMonth
            : rootContext.validationProps.maxDate,
          disablePast: rootContext.validationProps.disablePast,
          disableFuture: rootContext.validationProps.disableFuture,
          isDateDisabled: rootContext.isDateDisabled,
          timezone: rootContext.timezone,
        })
      : newCleanValue;

    if (closestEnabledDate) {
      rootContext.setVisibleDate(closestEnabledDate, true);
      rootContext.setValue(closestEnabledDate, { section: 'month' });
    }
  });

  const registerSection = rootContext.registerSection;
  React.useEffect(() => {
    return registerSection({ type: 'month', value: currentYear });
  }, [registerSection, currentYear]);

  const context: CalendarMonthsCellCollectionContext = React.useMemo(
    () => ({ selectMonth }),
    [selectMonth],
  );

  return { months, context };
}

export namespace useCalendarMonthsCellCollection {
  export interface ReturnValue {
    months: PickerValidDate[];
    context: CalendarMonthsCellCollectionContext;
  }
}

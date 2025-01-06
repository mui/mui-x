import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../../models';
import { findClosestEnabledDate } from '../../../../utils/date-utils';
import { useUtils } from '../../../../hooks/useUtils';
import { useCalendarRootContext } from '../../root/CalendarRootContext';
import { CalendarYearsCellCollectionContext } from './CalendarYearsCellCollectionContext';

export function useCalendarYearsCellCollection(): useCalendarYearsCellCollection.ReturnValue {
  const rootContext = useCalendarRootContext();
  const utils = useUtils();

  const years = React.useMemo(
    () =>
      utils.getYearRange([
        rootContext.validationProps.minDate,
        rootContext.validationProps.maxDate,
      ]),
    [utils, rootContext.validationProps.minDate, rootContext.validationProps.maxDate],
  );

  const selectYear = useEventCallback((newValue: PickerValidDate) => {
    if (rootContext.readOnly) {
      return;
    }

    const newCleanValue = utils.setYear(
      rootContext.value ?? rootContext.referenceDate,
      utils.getYear(newValue),
    );

    const startOfYear = utils.startOfYear(newCleanValue);
    const endOfYear = utils.endOfYear(newCleanValue);

    const closestEnabledDate = rootContext.isDateDisabled(newCleanValue)
      ? findClosestEnabledDate({
          utils,
          date: newCleanValue,
          minDate: utils.isBefore(rootContext.validationProps.minDate, startOfYear)
            ? startOfYear
            : rootContext.validationProps.minDate,
          maxDate: utils.isAfter(rootContext.validationProps.maxDate, endOfYear)
            ? endOfYear
            : rootContext.validationProps.maxDate,
          disablePast: rootContext.validationProps.disablePast,
          disableFuture: rootContext.validationProps.disableFuture,
          isDateDisabled: rootContext.isDateDisabled,
          timezone: rootContext.timezone,
        })
      : newCleanValue;

    if (closestEnabledDate) {
      rootContext.setValue(closestEnabledDate, { section: 'year' });
    }
  });

  const registerSection = rootContext.registerSection;
  React.useEffect(() => {
    return registerSection({ type: 'month', value: rootContext.visibleDate });
  }, [registerSection, rootContext.visibleDate]);

  const context: CalendarYearsCellCollectionContext = React.useMemo(
    () => ({ selectYear }),
    [selectYear],
  );

  return { years, context };
}

export namespace useCalendarYearsCellCollection {
  export interface ReturnValue {
    years: PickerValidDate[];
    context: CalendarYearsCellCollectionContext;
  }
}

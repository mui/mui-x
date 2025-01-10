import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { getMonthsInYear } from '../../../../utils/date-utils';
import { useUtils } from '../../../../hooks/useUtils';
import { getFirstEnabledYear, getLastEnabledYear } from './date';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { BaseCalendarMonthsGridOrListContext } from '../months-grid/BaseCalendarMonthsGridOrListContext';

export function useMonthsCells(): useMonthsCells.ReturnValue {
  const baseRootContext = useBaseCalendarRootContext();
  const utils = useUtils();

  const currentYear = React.useMemo(
    () => utils.startOfYear(baseRootContext.visibleDate),
    [utils, baseRootContext.visibleDate],
  );

  const months = React.useMemo(() => getMonthsInYear(utils, currentYear), [utils, currentYear]);

  const tabbableMonths = React.useMemo(() => {
    let tempTabbableDays: PickerValidDate[] = [];
    tempTabbableDays = months.filter((day) =>
      baseRootContext.selectedDates.some((selectedDay) => utils.isSameMonth(day, selectedDay)),
    );

    if (tempTabbableDays.length === 0) {
      tempTabbableDays = months.filter((day) =>
        utils.isSameMonth(day, baseRootContext.currentDate),
      );
    }

    if (tempTabbableDays.length === 0) {
      tempTabbableDays = [months[0]];
    }

    return tempTabbableDays;
  }, [baseRootContext.currentDate, baseRootContext.selectedDates, months, utils]);

  const monthsListOrGridContext = React.useMemo<BaseCalendarMonthsGridOrListContext>(
    () => ({
      tabbableMonths,
    }),
    [tabbableMonths],
  );

  const changePage = (direction: 'next' | 'previous') => {
    // TODO: Jump over months with no valid date.
    if (direction === 'previous') {
      const targetDate = utils.addYears(
        utils.startOfYear(baseRootContext.visibleDate),
        -baseRootContext.yearPageSize,
      );
      const lastYearInNewPage = utils.addYears(targetDate, baseRootContext.yearPageSize - 1);

      // All the years before the visible ones are fully disabled, we skip the navigation.
      if (
        utils.isAfter(
          getFirstEnabledYear(utils, baseRootContext.dateValidationProps),
          lastYearInNewPage,
        )
      ) {
        return;
      }

      baseRootContext.setVisibleDate(
        utils.addYears(baseRootContext.visibleDate, -baseRootContext.yearPageSize),
        false,
      );
    }
    if (direction === 'next') {
      const targetDate = utils.addYears(
        utils.startOfYear(baseRootContext.visibleDate),
        baseRootContext.yearPageSize,
      );

      // All the years after the visible ones are fully disabled, we skip the navigation.
      if (
        utils.isBefore(getLastEnabledYear(utils, baseRootContext.dateValidationProps), targetDate)
      ) {
        return;
      }
      baseRootContext.setVisibleDate(
        utils.addYears(baseRootContext.visibleDate, baseRootContext.yearPageSize),
        false,
      );
    }
  };

  const registerSection = baseRootContext.registerSection;
  React.useEffect(() => {
    return registerSection({ type: 'month', value: currentYear });
  }, [registerSection, currentYear]);

  return { months, monthsListOrGridContext, changePage };
}

export namespace useMonthsCells {
  export interface ReturnValue {
    months: PickerValidDate[];
    monthsListOrGridContext: BaseCalendarMonthsGridOrListContext;
    changePage: (direction: 'next' | 'previous') => void;
  }
}

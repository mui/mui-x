import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { useUtils } from '../../../../hooks/useUtils';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { BaseCalendarYearsGridOrListContext } from '../years-grid/BaseCalendarYearsGridOrListContext';

export function useYearsCells(): useYearsCells.ReturnValue {
  const baseRootContext = useBaseCalendarRootContext();
  const utils = useUtils();

  const years = React.useMemo(
    () =>
      utils.getYearRange([
        baseRootContext.dateValidationProps.minDate,
        baseRootContext.dateValidationProps.maxDate,
      ]),
    [
      utils,
      baseRootContext.dateValidationProps.minDate,
      baseRootContext.dateValidationProps.maxDate,
    ],
  );

  const tabbableYears = React.useMemo(() => {
    let tempTabbableDays: PickerValidDate[] = [];
    tempTabbableDays = years.filter((day) =>
      baseRootContext.selectedDates.some((selectedDay) => utils.isSameYear(day, selectedDay)),
    );

    if (tempTabbableDays.length === 0) {
      tempTabbableDays = years.filter((day) => utils.isSameYear(day, baseRootContext.currentDate));
    }

    return tempTabbableDays;
  }, [baseRootContext.currentDate, baseRootContext.selectedDates, years, utils]);

  const yearsListOrGridContext = React.useMemo<BaseCalendarYearsGridOrListContext>(
    () => ({
      tabbableYears,
    }),
    [tabbableYears],
  );

  const registerSection = baseRootContext.registerSection;
  React.useEffect(() => {
    return registerSection({ type: 'month', value: baseRootContext.visibleDate });
  }, [registerSection, baseRootContext.visibleDate]);

  return { years, yearsListOrGridContext };
}

export namespace useYearsCells {
  export interface ReturnValue {
    years: PickerValidDate[];
    yearsListOrGridContext: BaseCalendarYearsGridOrListContext;
  }
}

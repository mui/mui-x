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

  const scrollerRef = React.useRef<HTMLElement>(null);
  React.useEffect(
    () => {
      // TODO: Make sure this behavior remain consistent once auto focus is implemented.
      if (/* autoFocus || */ scrollerRef.current === null) {
        return;
      }
      const tabbableButton = scrollerRef.current.querySelector<HTMLElement>('[tabindex="0"]');
      if (!tabbableButton) {
        return;
      }

      // Taken from useScroll in x-data-grid, but vertically centered
      const offsetHeight = tabbableButton.offsetHeight;
      const offsetTop = tabbableButton.offsetTop;

      const clientHeight = scrollerRef.current.clientHeight;
      const scrollTop = scrollerRef.current.scrollTop;

      const elementBottom = offsetTop + offsetHeight;

      if (offsetHeight > clientHeight || offsetTop < scrollTop) {
        // Button already visible
        return;
      }

      scrollerRef.current.scrollTop = elementBottom - clientHeight / 2 - offsetHeight / 2;
    },
    [
      /* autoFocus */
    ],
  );

  return { years, yearsListOrGridContext, scrollerRef };
}

export namespace useYearsCells {
  export interface ReturnValue {
    years: PickerValidDate[];
    yearsListOrGridContext: BaseCalendarYearsGridOrListContext;
    scrollerRef: React.RefObject<HTMLElement | null>;
  }
}

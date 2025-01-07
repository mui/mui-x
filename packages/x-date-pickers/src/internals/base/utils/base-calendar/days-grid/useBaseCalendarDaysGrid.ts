import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../../models';
import { useUtils } from '../../../../hooks/useUtils';
import { mergeDateAndTime } from '../../../../utils/date-utils';
import { useCalendarRootContext } from '../../../Calendar/root/CalendarRootContext';
import { GenericHTMLProps } from '../../../base-utils/types';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { BaseCalendarDaysGridContext } from './BaseCalendarDaysGridContext';

export function useBaseCalendarDaysGrid(parameters: useBaseCalendarDaysGrid.Parameters) {
  const { fixedWeekNumber, offset = 0 } = parameters;
  const utils = useUtils();
  const rootContext = useCalendarRootContext();
  const baseRootContext = useBaseCalendarRootContext();

  const currentMonth = React.useMemo(() => {
    const cleanVisibleDate = utils.startOfMonth(baseRootContext.visibleDate);
    return offset === 0 ? cleanVisibleDate : utils.addMonths(cleanVisibleDate, offset);
  }, [utils, baseRootContext.visibleDate, offset]);

  const daysGrid = React.useMemo(() => {
    const toDisplay = utils.getWeekArray(currentMonth);
    let nextMonth = utils.addMonths(currentMonth, 1);
    while (fixedWeekNumber && toDisplay.length < fixedWeekNumber) {
      const additionalWeeks = utils.getWeekArray(nextMonth);
      const hasCommonWeek = utils.isSameDay(
        toDisplay[toDisplay.length - 1][0],
        additionalWeeks[0][0],
      );

      additionalWeeks.slice(hasCommonWeek ? 1 : 0).forEach((week) => {
        if (toDisplay.length < fixedWeekNumber) {
          toDisplay.push(week);
        }
      });

      nextMonth = utils.addMonths(nextMonth, 1);
    }

    return toDisplay;
  }, [currentMonth, fixedWeekNumber, utils]);

  const getDaysGridProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeReactProps(externalProps, {
      role: 'grid',
    });
  }, []);

  const selectDay = useEventCallback((newValue: PickerValidDate) => {
    if (baseRootContext.readOnly) {
      return;
    }

    const newCleanValue = mergeDateAndTime(
      utils,
      newValue,
      rootContext.value ?? rootContext.referenceValue,
    );

    rootContext.setValue(newCleanValue, { section: 'day' });
  });

  const tabbableDay = React.useMemo(() => {
    const flatDays = daysGrid.flat();
    const tempTabbableDay = rootContext.value ?? rootContext.referenceValue;
    if (flatDays.some((day) => utils.isSameDay(day, tempTabbableDay))) {
      return tempTabbableDay;
    }

    return flatDays.find((day) => utils.isSameMonth(day, currentMonth)) ?? null;
  }, [rootContext.value, rootContext.referenceValue, daysGrid, utils, currentMonth]);

  const registerSection = baseRootContext.registerSection;
  React.useEffect(() => {
    return registerSection({ type: 'day', value: currentMonth });
  }, [registerSection, currentMonth]);

  const context: BaseCalendarDaysGridContext = React.useMemo(
    () => ({ selectDay, daysGrid, currentMonth, tabbableDay }),
    [selectDay, daysGrid, currentMonth, tabbableDay],
  );

  return React.useMemo(() => ({ getDaysGridProps, context }), [getDaysGridProps, context]);
}

export namespace useBaseCalendarDaysGrid {
  export interface Parameters {
    /**
     * The day view will show as many weeks as needed after the end of the current month to match this value.
     * Put it to 6 to have a fixed number of weeks in Gregorian calendars
     */
    fixedWeekNumber?: number;
    /**
     * The offset to apply to the rendered month compared to the current month.
     * This is mostly useful when displaying multiple day grids.
     * @default 0
     */
    offset?: number;
  }
}

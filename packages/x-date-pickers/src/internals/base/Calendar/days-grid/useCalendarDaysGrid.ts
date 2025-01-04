import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';
import { useUtils } from '../../../hooks/useUtils';
import { mergeDateAndTime } from '../../../utils/date-utils';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { GenericHTMLProps } from '../../utils/types';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { CalendarDaysGridContext } from './CalendarDaysGridContext';

export function useCalendarDaysGrid(parameters: useCalendarDaysGrid.Parameters) {
  const { alwaysVisible = false, fixedWeekNumber } = parameters;
  const utils = useUtils();
  const calendarRootContext = useCalendarRootContext();

  const daysGrid = React.useMemo(() => {
    const toDisplay = utils.getWeekArray(calendarRootContext.visibleDate);
    let nextMonth = utils.addMonths(calendarRootContext.visibleDate, 1);
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
  }, [calendarRootContext.visibleDate, fixedWeekNumber, utils]);

  const getDaysGridProps = React.useCallback((externalProps: GenericHTMLProps) => {
    return mergeReactProps(externalProps, {
      role: 'grid',
    });
  }, []);

  const selectDay = useEventCallback((newValue: PickerValidDate) => {
    if (calendarRootContext.readOnly) {
      return;
    }

    const newCleanValue = mergeDateAndTime(
      utils,
      newValue,
      calendarRootContext.value ?? calendarRootContext.referenceDate,
    );

    calendarRootContext.setValue(newCleanValue, 'day');
  });

  const context: CalendarDaysGridContext = React.useMemo(
    () => ({ selectDay, daysGrid }),
    [selectDay, daysGrid],
  );

  const shouldRender = calendarRootContext.activeSection === 'day' || alwaysVisible;

  return React.useMemo(
    () => ({ getDaysGridProps, context, shouldRender }),
    [getDaysGridProps, context, shouldRender],
  );
}

export namespace useCalendarDaysGrid {
  export interface Parameters {
    /**
     * The day view will show as many weeks as needed after the end of the current month to match this value.
     * Put it to 6 to have a fixed number of weeks in Gregorian calendars
     */
    fixedWeekNumber?: number;
    /**
     * If `true`, the year list will always be visible even when the active section is not 'year'.
     * @default false
     */
    alwaysVisible?: boolean;
  }
}

import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../../models';
import { useUtils } from '../../../../hooks/useUtils';
import { mergeReactProps } from '../../../base-utils/mergeReactProps';
import { GenericHTMLProps } from '../../../base-utils/types';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { BaseCalendarDaysGridBodyContext } from './BaseCalendarDaysGridBodyContext';
import { useCellList } from '../utils/useCellList';
import { mergeDateAndTime } from '../../../../utils/date-utils';
import { useBaseCalendarRootVisibleDateContext } from '../root/BaseCalendarRootVisibleDateContext';

export function useBaseCalendarDaysGridBody(parameters: useBaseCalendarDaysGridBody.Parameters) {
  const {
    fixedWeekNumber,
    focusOnMount,
    children,
    offset = 0,
    freezeCurrentMonth = false,
  } = parameters;
  const utils = useUtils();
  const baseRootContext = useBaseCalendarRootContext();
  const baseRootVisibleDateContext = useBaseCalendarRootVisibleDateContext();
  const ref = React.useRef<HTMLDivElement>(null);
  const rowsRefs = React.useRef<(HTMLElement | null)[]>([]);

  const rawCurrentMonth = React.useMemo(() => {
    const cleanVisibleDate = utils.startOfMonth(baseRootVisibleDateContext.visibleDate);
    return offset === 0 ? cleanVisibleDate : utils.addMonths(cleanVisibleDate, offset);
  }, [utils, baseRootVisibleDateContext.visibleDate, offset]);

  const lastNonFrozenMonthRef = React.useRef(rawCurrentMonth);
  React.useEffect(() => {
    if (!freezeCurrentMonth) {
      lastNonFrozenMonthRef.current = rawCurrentMonth;
    }
  }, [freezeCurrentMonth, rawCurrentMonth]);

  const currentMonth = freezeCurrentMonth ? lastNonFrozenMonthRef.current : rawCurrentMonth;

  const { scrollerRef } = useCellList({
    focusOnMount,
    section: 'day',
    value: currentMonth,
  });

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

  const selectDay = useEventCallback((newValue: PickerValidDate) => {
    if (baseRootContext.readOnly) {
      return;
    }

    const newCleanValue = mergeDateAndTime(utils, newValue, baseRootContext.currentDate);

    baseRootContext.selectDate(newCleanValue, { section: 'day' });
  });

  const tabbableDays = React.useMemo(() => {
    const flatDays = daysGrid.flat().filter((day) => utils.isSameMonth(day, currentMonth));

    let tempTabbableDays: PickerValidDate[] = [];
    tempTabbableDays = flatDays.filter((day) =>
      baseRootContext.selectedDates.some((selectedDay) => utils.isSameDay(day, selectedDay)),
    );

    if (tempTabbableDays.length === 0) {
      tempTabbableDays = flatDays.filter((day) =>
        utils.isSameDay(day, baseRootContext.currentDate),
      );
    }

    if (tempTabbableDays.length === 0) {
      const firstDayInMonth = flatDays.find((day) => utils.isSameMonth(day, currentMonth));
      if (firstDayInMonth != null) {
        tempTabbableDays = [firstDayInMonth];
      }
    }

    return tempTabbableDays;
  }, [baseRootContext.currentDate, baseRootContext.selectedDates, daysGrid, utils, currentMonth]);

  const childrenNode = React.useMemo(
    () => (children == null ? null : children({ weeks: daysGrid.map((week) => week[0]) })),
    [children, daysGrid],
  );

  const getDaysGridBodyProps = React.useCallback(
    (externalProps: GenericHTMLProps) => {
      return mergeReactProps(externalProps, {
        ref,
        role: 'rowgroup',
        children: childrenNode,
        onKeyDown: baseRootContext.applyDayGridKeyboardNavigation,
      });
    },
    [baseRootContext.applyDayGridKeyboardNavigation, childrenNode],
  );

  const context: BaseCalendarDaysGridBodyContext = React.useMemo(
    () => ({ selectDay, daysGrid, currentMonth, tabbableDays, ref }),
    [selectDay, daysGrid, currentMonth, tabbableDays, ref],
  );

  return React.useMemo(
    () => ({ getDaysGridBodyProps, rowsRefs, context, scrollerRef }),
    [getDaysGridBodyProps, rowsRefs, context, scrollerRef],
  );
}

export namespace useBaseCalendarDaysGridBody {
  export interface Parameters extends useCellList.PublicParameters {
    children?: (parameters: ChildrenParameters) => React.ReactNode;
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
    /**
     * If `true`, the first tabbable children inside this component will be focused on mount.
     * @default false
     */
    focusOnMount?: boolean;
    /**
     * If `true`, the component's month won't update when the visible date or the offset changes.
     * This is mostly useful when doing transitions between several months to avoid having the exiting month updated to the new visible date.
     */
    freezeCurrentMonth?: boolean;
  }

  export interface ChildrenParameters {
    weeks: PickerValidDate[];
  }
}

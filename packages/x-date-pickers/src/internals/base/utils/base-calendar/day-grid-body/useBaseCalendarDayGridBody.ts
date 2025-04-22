import * as React from 'react';
import { PickerValidDate } from '../../../../../models';
import { useUtils } from '../../../../hooks/useUtils';
import { mergeProps } from '../../../base-utils/mergeProps';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { CalendarDayGridBodyContext } from './CalendarDayGridBodyContext';
import { useRegisterSection } from '../utils/useRegisterSection';
import { useBaseCalendarRootVisibleDateContext } from '../root/BaseCalendarRootVisibleDateContext';
import { useScrollableList } from '../../useScrollableList';

export function useBaseCalendarDayGridBody(parameters: useBaseCalendarDayGridBody.Parameters) {
  const { fixedWeekNumber, focusOnMount, children, offset = 0, freezeMonth = false } = parameters;
  const utils = useUtils();
  const baseRootContext = useBaseCalendarRootContext();
  const baseRootVisibleDateContext = useBaseCalendarRootVisibleDateContext();
  const ref = React.useRef<HTMLDivElement>(null);
  const rowsRefs = React.useRef<(HTMLElement | null)[]>([]);

  const rawMonth = React.useMemo(() => {
    const cleanVisibleDate = utils.startOfMonth(baseRootVisibleDateContext.visibleDate);
    return offset === 0 ? cleanVisibleDate : utils.addMonths(cleanVisibleDate, offset);
  }, [utils, baseRootVisibleDateContext.visibleDate, offset]);

  const lastNonFrozenMonthRef = React.useRef(rawMonth);
  React.useEffect(() => {
    if (!freezeMonth) {
      lastNonFrozenMonthRef.current = rawMonth;
    }
  }, [freezeMonth, rawMonth]);

  const month = freezeMonth ? lastNonFrozenMonthRef.current : rawMonth;

  const { scrollerRef } = useScrollableList({ focusOnMount });
  useRegisterSection({
    section: 'day',
    value: month,
  });

  const daysGrid = React.useMemo(() => {
    const toDisplay = utils.getWeekArray(month);
    let nextMonth = utils.addMonths(month, 1);
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
  }, [month, fixedWeekNumber, utils]);

  const canCellBeTabbed = React.useMemo(() => {
    let tabbableCells: PickerValidDate[];
    const daysInMonth = daysGrid.flat().filter((day) => utils.isSameMonth(day, month));
    const selectedAndVisibleDays = daysInMonth.filter((day) =>
      baseRootContext.selectedDates.some((selectedDay) => utils.isSameDay(day, selectedDay)),
    );
    if (selectedAndVisibleDays.length > 0) {
      tabbableCells = selectedAndVisibleDays;
    } else {
      const currentDay = daysInMonth.find((day) =>
        utils.isSameDay(day, baseRootContext.currentDate),
      );
      if (currentDay != null) {
        tabbableCells = [currentDay];
      } else {
        tabbableCells = daysInMonth.slice(0, 1);
      }
    }

    const format = `${utils.formats.year}/${utils.formats.month}/${utils.formats.dayOfMonth}`;
    const formattedTabbableCells = new Set(
      tabbableCells.map((day) => utils.formatByString(day, format)),
    );

    return (date: PickerValidDate) =>
      formattedTabbableCells.has(utils.formatByString(date, format));
  }, [baseRootContext.currentDate, baseRootContext.selectedDates, daysGrid, utils, month]);

  const resolvedChildren = React.useMemo(() => {
    if (!React.isValidElement(children) && typeof children === 'function') {
      return children({ weeks: daysGrid.map((week) => week[0]) });
    }

    return children;
  }, [children, daysGrid]);

  const getDayGridBodyProps = React.useCallback(
    (externalProps = {}): React.ComponentPropsWithRef<'div'> => {
      return mergeProps(
        {
          ref,
          role: 'rowgroup',
          children: resolvedChildren,
          onKeyDown: baseRootContext.applyDayGridKeyboardNavigation,
        },
        externalProps,
      );
    },
    [baseRootContext.applyDayGridKeyboardNavigation, resolvedChildren],
  );

  const context: CalendarDayGridBodyContext = React.useMemo(
    () => ({ daysGrid, month, canCellBeTabbed, ref }),
    [daysGrid, month, canCellBeTabbed, ref],
  );

  return React.useMemo(
    () => ({ getDayGridBodyProps, rowsRefs, context, scrollerRef }),
    [getDayGridBodyProps, rowsRefs, context, scrollerRef],
  );
}

export namespace useBaseCalendarDayGridBody {
  export interface Parameters extends useScrollableList.Parameters {
    /**
     * The children of the component.
     * If a function is provided, it will be called with the weeks weeks to render as its parameter.
     */
    children?: React.ReactNode | ((parameters: ChildrenParameters) => React.ReactNode);
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
     * If `true`, the component's month won't update when the visible date or the offset changes.
     * This is mostly useful when doing transitions between several months to avoid having the exiting month updated to the new visible date.
     */
    freezeMonth?: boolean;
  }

  export interface ChildrenParameters {
    weeks: PickerValidDate[];
  }
}

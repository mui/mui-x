'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { SlideDirection } from './PickersSlideTransition';
import { useIsDateDisabled } from './useIsDateDisabled';
import { MuiPickersAdapter, PickersTimezone, PickerValidDate } from '../models';
import { DateCalendarDefaultizedProps } from './DateCalendar.types';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { SECTION_TYPE_GRANULARITY } from '../internals/utils/getDefaultReferenceDate';
import { findClosestEnabledDate } from '../internals/utils/date-utils';
import { usePickerAdapter } from '../hooks/usePickerAdapter';

interface CalendarState {
  currentMonth: PickerValidDate;
  focusedDay: PickerValidDate | null;
  isMonthSwitchingAnimating: boolean;
  slideDirection: SlideDirection;
}

type ReducerAction<TType, TAdditional = {}> = { type: TType } & TAdditional;

interface SetVisibleDatePayload {
  direction: SlideDirection;
  month: PickerValidDate;
  focusedDay: PickerValidDate | null;
  /**
   * The update does not trigger month switching animation.
   * It can be useful when selecting month from the month view.
   */
  skipAnimation: boolean;
}

const createCalendarStateReducer =
  (reduceAnimations: boolean, adapter: MuiPickersAdapter) =>
  (
    state: CalendarState,
    action:
      | ReducerAction<'finishMonthSwitchingAnimation'>
      | ReducerAction<'setVisibleDate', SetVisibleDatePayload>
      | ReducerAction<'changeMonthTimezone', { newTimezone: string }>,
  ): CalendarState => {
    switch (action.type) {
      case 'setVisibleDate':
        return {
          ...state,
          slideDirection: action.direction,
          currentMonth: action.month,
          isMonthSwitchingAnimating:
            !adapter.isSameMonth(action.month, state.currentMonth) &&
            !reduceAnimations &&
            !action.skipAnimation,
          focusedDay: action.focusedDay,
        };

      case 'changeMonthTimezone': {
        const newTimezone = action.newTimezone;
        if (adapter.getTimezone(state.currentMonth) === newTimezone) {
          return state;
        }
        let newCurrentMonth = adapter.setTimezone(state.currentMonth, newTimezone);
        if (adapter.getMonth(newCurrentMonth) !== adapter.getMonth(state.currentMonth)) {
          newCurrentMonth = adapter.setMonth(newCurrentMonth, adapter.getMonth(state.currentMonth));
        }
        return {
          ...state,
          currentMonth: newCurrentMonth,
        };
      }

      case 'finishMonthSwitchingAnimation':
        return {
          ...state,
          isMonthSwitchingAnimating: false,
        };

      default:
        throw new Error('missing support');
    }
  };

interface UseCalendarStateParameters
  extends Pick<
    DateCalendarDefaultizedProps,
    | 'referenceDate'
    | 'disableFuture'
    | 'disablePast'
    | 'minDate'
    | 'maxDate'
    | 'onMonthChange'
    | 'onYearChange'
    | 'reduceAnimations'
    | 'shouldDisableDate'
  > {
  value: PickerValidDate | null;
  timezone: PickersTimezone;
  getCurrentMonthFromVisibleDate: (
    focusedDay: PickerValidDate,
    prevMonth: PickerValidDate,
  ) => PickerValidDate;
}

interface UseCalendarStateReturnValue {
  referenceDate: PickerValidDate;
  calendarState: CalendarState;
  setVisibleDate: (parameters: SetVisibleDateParameters) => void;
  isDateDisabled: (day: PickerValidDate | null) => boolean;
  onMonthSwitchingAnimationEnd: () => void;
}

export const useCalendarState = (
  params: UseCalendarStateParameters,
): UseCalendarStateReturnValue => {
  const {
    value,
    referenceDate: referenceDateProp,
    disableFuture,
    disablePast,
    maxDate,
    minDate,
    onMonthChange,
    onYearChange,
    reduceAnimations,
    shouldDisableDate,
    timezone,
    getCurrentMonthFromVisibleDate,
  } = params;

  const adapter = usePickerAdapter();

  const reducerFn = React.useRef(
    createCalendarStateReducer(Boolean(reduceAnimations), adapter),
  ).current;

  const referenceDate = React.useMemo<PickerValidDate>(
    () => {
      return singleItemValueManager.getInitialReferenceValue({
        value,
        adapter,
        timezone,
        props: params,
        referenceDate: referenceDateProp,
        granularity: SECTION_TYPE_GRANULARITY.day,
      });
    },
    // We want the `referenceDate` to update on prop and `timezone` change (https://github.com/mui/mui-x/issues/10804)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [referenceDateProp, timezone],
  );

  const [calendarState, dispatch] = React.useReducer(reducerFn, {
    isMonthSwitchingAnimating: false,
    focusedDay: referenceDate,
    currentMonth: adapter.startOfMonth(referenceDate),
    slideDirection: 'left',
  });

  const isDateDisabled = useIsDateDisabled({
    shouldDisableDate,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    timezone,
  });

  // Ensure that `calendarState.currentMonth` timezone is updated when `referenceDate` (or timezone changes)
  // https://github.com/mui/mui-x/issues/10804
  React.useEffect(() => {
    dispatch({
      type: 'changeMonthTimezone',
      newTimezone: adapter.getTimezone(referenceDate),
    });
  }, [referenceDate, adapter]);

  const setVisibleDate = useEventCallback(({ target, reason }: SetVisibleDateParameters) => {
    if (
      reason === 'cell-interaction' &&
      calendarState.focusedDay != null &&
      adapter.isSameDay(target, calendarState.focusedDay)
    ) {
      return;
    }

    const skipAnimation = reason === 'cell-interaction';
    let month: PickerValidDate;
    let focusedDay: PickerValidDate | null;
    if (reason === 'cell-interaction') {
      month = getCurrentMonthFromVisibleDate(target, calendarState.currentMonth);
      focusedDay = target;
    } else {
      month = adapter.isSameMonth(target, calendarState.currentMonth)
        ? calendarState.currentMonth
        : adapter.startOfMonth(target);
      focusedDay = target;

      // If the date is disabled, we try to find a non-disabled date inside the same month.
      if (isDateDisabled(focusedDay)) {
        const startOfMonth = adapter.startOfMonth(target);
        const endOfMonth = adapter.endOfMonth(target);
        focusedDay = findClosestEnabledDate({
          adapter,
          date: focusedDay,
          minDate: adapter.isBefore(minDate, startOfMonth) ? startOfMonth : minDate,
          maxDate: adapter.isAfter(maxDate, endOfMonth) ? endOfMonth : maxDate,
          disablePast,
          disableFuture,
          isDateDisabled,
          timezone,
        });
      }
    }

    const hasChangedMonth = !adapter.isSameMonth(calendarState.currentMonth, month);
    const hasChangedYear = !adapter.isSameYear(calendarState.currentMonth, month);
    if (hasChangedMonth) {
      onMonthChange?.(month);
    }
    if (hasChangedYear) {
      onYearChange?.(adapter.startOfYear(month));
    }

    dispatch({
      type: 'setVisibleDate',
      month,
      direction: adapter.isAfterDay(month, calendarState.currentMonth) ? 'left' : 'right',
      focusedDay:
        calendarState.focusedDay != null &&
        focusedDay != null &&
        adapter.isSameDay(focusedDay, calendarState.focusedDay)
          ? calendarState.focusedDay
          : focusedDay,
      skipAnimation,
    });
  });

  const onMonthSwitchingAnimationEnd = React.useCallback(() => {
    dispatch({ type: 'finishMonthSwitchingAnimation' });
  }, []);

  return {
    referenceDate,
    calendarState,
    setVisibleDate,
    isDateDisabled,
    onMonthSwitchingAnimationEnd,
  };
};

interface SetVisibleDateParameters {
  target: PickerValidDate;
  reason: 'header-navigation' | 'cell-interaction' | 'controlled-value-change';
}

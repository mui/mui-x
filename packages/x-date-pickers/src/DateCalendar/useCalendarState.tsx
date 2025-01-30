'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { SlideDirection } from './PickersSlideTransition';
import { useIsDateDisabled } from './useIsDateDisabled';
import { useUtils } from '../internals/hooks/useUtils';
import { MuiPickersAdapter, PickersTimezone, PickerValidDate } from '../models';
import { DateCalendarDefaultizedProps } from './DateCalendar.types';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { SECTION_TYPE_GRANULARITY } from '../internals/utils/getDefaultReferenceDate';
import { findClosestEnabledDate } from '../internals/utils/date-utils';

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
  (reduceAnimations: boolean, utils: MuiPickersAdapter) =>
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
            !utils.isSameMonth(action.month, state.currentMonth) &&
            !reduceAnimations &&
            !action.skipAnimation,
          focusedDay: action.focusedDay,
        };

      case 'changeMonthTimezone': {
        const newTimezone = action.newTimezone;
        if (utils.getTimezone(state.currentMonth) === newTimezone) {
          return state;
        }
        let newCurrentMonth = utils.setTimezone(state.currentMonth, newTimezone);
        if (utils.getMonth(newCurrentMonth) !== utils.getMonth(state.currentMonth)) {
          newCurrentMonth = utils.setMonth(newCurrentMonth, utils.getMonth(state.currentMonth));
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
  setVisibleDate: (date: PickerValidDate, skipAnimation?: boolean) => void;
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

  const utils = useUtils();

  const reducerFn = React.useRef(
    createCalendarStateReducer(Boolean(reduceAnimations), utils),
  ).current;

  const referenceDate = React.useMemo<PickerValidDate>(
    () => {
      return singleItemValueManager.getInitialReferenceValue({
        value,
        utils,
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
    currentMonth: utils.startOfMonth(referenceDate),
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
      newTimezone: utils.getTimezone(referenceDate),
    });
  }, [referenceDate, utils]);

  const setVisibleDate = useEventCallback(
    (date: PickerValidDate, skipAnimation: boolean = false) => {
      let focusedDay: PickerValidDate | null =
        calendarState.focusedDay != null && utils.isSameDay(date, calendarState.focusedDay)
          ? calendarState.focusedDay
          : date;

      // If the date is disabled, we try to find a non-disabled date inside the same month.
      if (isDateDisabled(focusedDay)) {
        const startOfMonth = utils.startOfMonth(date);
        const endOfMonth = utils.endOfMonth(date);
        focusedDay = findClosestEnabledDate({
          utils,
          date: focusedDay,
          minDate: utils.isBefore(minDate, startOfMonth) ? startOfMonth : minDate,
          maxDate: utils.isAfter(maxDate, endOfMonth) ? endOfMonth : maxDate,
          disablePast,
          disableFuture,
          isDateDisabled,
          timezone,
        });
      }

      const newMonth = getCurrentMonthFromVisibleDate(date, calendarState.currentMonth);
      const hasChangedMonth = !utils.isSameMonth(calendarState.currentMonth, newMonth);
      const hasChangedYear = !utils.isSameYear(calendarState.currentMonth, newMonth);

      dispatch({
        type: 'setVisibleDate',
        month: newMonth,
        direction: utils.isAfterDay(newMonth, calendarState.currentMonth) ? 'left' : 'right',
        focusedDay,
        skipAnimation,
      });

      if (hasChangedMonth) {
        onMonthChange?.(newMonth);
      }

      if (hasChangedYear) {
        onYearChange?.(utils.startOfYear(newMonth));
      }
    },
  );

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

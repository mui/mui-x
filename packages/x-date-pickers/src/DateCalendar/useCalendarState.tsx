'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { SlideDirection } from './PickersSlideTransition';
import { useIsDateDisabled } from './useIsDateDisabled';
import { useUtils } from '../internals/hooks/useUtils';
import { DateView, MuiPickersAdapter, PickersTimezone, PickerValidDate } from '../models';
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

interface ChangeMonthPayload {
  direction: SlideDirection;
  newMonth: PickerValidDate;
  newFocusedDay: PickerValidDate | null;
}

interface ChangeFocusedDayPayload {
  focusedDay: PickerValidDate | null;
  /**
   * The update does not trigger month switching animation.
   * For example: when selecting month from the month view.
   */
  withoutMonthSwitchingAnimation?: boolean;
}

export const createCalendarStateReducer =
  (reduceAnimations: boolean, calendars: number, utils: MuiPickersAdapter) =>
  (
    state: CalendarState,
    action:
      | ReducerAction<'finishMonthSwitchingAnimation'>
      | ReducerAction<'changeMonth', ChangeMonthPayload>
      | ReducerAction<'changeMonthTimezone', { newTimezone: string }>
      | ReducerAction<'changeFocusedDay', ChangeFocusedDayPayload>,
  ): CalendarState => {
    switch (action.type) {
      case 'changeMonth':
        return {
          ...state,
          slideDirection: action.direction,
          currentMonth: action.newMonth,
          isMonthSwitchingAnimating: !reduceAnimations,
          focusedDay: action.newFocusedDay,
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

      case 'changeFocusedDay': {
        if (
          state.focusedDay != null &&
          action.focusedDay != null &&
          utils.isSameDay(action.focusedDay, state.focusedDay)
        ) {
          return state;
        }

        const firstVisibleDate = utils.startOfMonth(state.currentMonth);
        const lastVisibleDate = utils.endOfMonth(
          utils.addMonths(state.currentMonth, calendars - 1),
        );

        const needMonthSwitch =
          action.focusedDay != null &&
          (utils.isBefore(action.focusedDay, firstVisibleDate) ||
            utils.isAfter(action.focusedDay, lastVisibleDate));

        return {
          ...state,
          focusedDay: action.focusedDay,
          isMonthSwitchingAnimating:
            needMonthSwitch && !reduceAnimations && !action.withoutMonthSwitchingAnimation,
          currentMonth: needMonthSwitch
            ? utils.startOfMonth(action.focusedDay!)
            : state.currentMonth,
          slideDirection:
            action.focusedDay != null && utils.isAfterDay(action.focusedDay, state.currentMonth)
              ? 'left'
              : 'right',
        };
      }

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
    | 'reduceAnimations'
    | 'shouldDisableDate'
  > {
  value: PickerValidDate | null;
  calendars?: number;
  timezone: PickersTimezone;
  focusedView: DateView | null;
}

interface UseCalendarStateReturnValue {
  referenceDate: PickerValidDate;
  calendarState: CalendarState;
  changeMonth: (newDate: PickerValidDate, shouldInitFocusedDay?: boolean) => void;
  changeFocusedDay: (
    newFocusedDate: PickerValidDate | null,
    withoutMonthSwitchingAnimation?: boolean,
  ) => void;
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
    calendars = 1,
    maxDate,
    minDate,
    onMonthChange,
    reduceAnimations,
    shouldDisableDate,
    timezone,
    focusedView,
  } = params;

  const utils = useUtils();

  const reducerFn = React.useRef(
    createCalendarStateReducer(Boolean(reduceAnimations), calendars, utils),
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
    focusedDay: focusedView != null ? referenceDate : null,
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

  const changeMonth = useEventCallback((date: PickerValidDate) => {
    if (utils.isSameMonth(date, calendarState.currentMonth)) {
      return;
    }

    const startOfMonth = utils.startOfMonth(date);
    let newFocusedDay: PickerValidDate | null;
    if (
      calendarState.focusedDay != null &&
      utils.isSameMonth(calendarState.focusedDay, startOfMonth)
    ) {
      newFocusedDay = calendarState.focusedDay;
    } else if (value != null && utils.isSameMonth(value, startOfMonth)) {
      newFocusedDay = value;
    } else if (utils.isSameMonth(referenceDate, startOfMonth)) {
      newFocusedDay = referenceDate;
    } else {
      newFocusedDay = startOfMonth;
    }

    if (isDateDisabled(newFocusedDay)) {
      const endOfMonth = utils.endOfMonth(startOfMonth);
      newFocusedDay = findClosestEnabledDate({
        utils,
        date: newFocusedDay,
        minDate: utils.isBefore(minDate, startOfMonth) ? startOfMonth : minDate,
        maxDate: utils.isAfter(maxDate, endOfMonth) ? endOfMonth : maxDate,
        disablePast,
        disableFuture,
        isDateDisabled,
        timezone,
      });
    }

    dispatch({
      type: 'changeMonth',
      newMonth: utils.startOfMonth(startOfMonth),
      direction: utils.isAfterDay(startOfMonth, calendarState.currentMonth) ? 'left' : 'right',
      newFocusedDay,
    });

    onMonthChange?.(startOfMonth);
  });

  const onMonthSwitchingAnimationEnd = React.useCallback(() => {
    dispatch({ type: 'finishMonthSwitchingAnimation' });
  }, []);

  const changeFocusedDay = useEventCallback(
    (newFocusedDate: PickerValidDate | null, withoutMonthSwitchingAnimation?: boolean) => {
      if (!isDateDisabled(newFocusedDate)) {
        dispatch({
          type: 'changeFocusedDay',
          focusedDay: newFocusedDate,
          withoutMonthSwitchingAnimation,
        });
      }
    },
  );

  return {
    referenceDate,
    calendarState,
    changeMonth,
    changeFocusedDay,
    isDateDisabled,
    onMonthSwitchingAnimationEnd,
  };
};

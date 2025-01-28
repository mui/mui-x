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
  newFocusedDay?: PickerValidDate | null;
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
          focusedDay: action.newFocusedDay === undefined ? state.focusedDay : action.newFocusedDay,
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
  handleChangeMonth: (payload: ChangeMonthPayload) => void;
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

  const getDateToFocusInDayView = useEventCallback((month: PickerValidDate) => {
    let focusedDay: PickerValidDate | null;
    if (value != null && utils.isSameMonth(value, month)) {
      focusedDay = value;
    } else if (utils.isSameMonth(referenceDate, month)) {
      focusedDay = referenceDate;
    } else {
      focusedDay = utils.startOfMonth(month);
    }

    if (isDateDisabled(focusedDay)) {
      const startOfMonth = utils.startOfMonth(month);
      const endOfMonth = utils.endOfMonth(month);
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

    return focusedDay;
  });

  // Ensure that `calendarState.currentMonth` timezone is updated when `referenceDate` (or timezone changes)
  // https://github.com/mui/mui-x/issues/10804
  React.useEffect(() => {
    dispatch({
      type: 'changeMonthTimezone',
      newTimezone: utils.getTimezone(referenceDate),
    });
  }, [referenceDate, utils]);

  const handleChangeMonth = React.useCallback(
    (payload: ChangeMonthPayload) => {
      dispatch({
        type: 'changeMonth',
        ...payload,
      });

      if (onMonthChange) {
        onMonthChange(payload.newMonth);
      }
    },
    [onMonthChange],
  );

  const changeMonth = useEventCallback(
    (newDate: PickerValidDate, shouldInitFocusedDay?: boolean) => {
      if (utils.isSameMonth(newDate, calendarState.currentMonth)) {
        return;
      }

      handleChangeMonth({
        newMonth: utils.startOfMonth(newDate),
        direction: utils.isAfterDay(newDate, calendarState.currentMonth) ? 'left' : 'right',
        newFocusedDay: shouldInitFocusedDay ? getDateToFocusInDayView(newDate) : undefined,
      });
    },
  );

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
    handleChangeMonth,
  };
};

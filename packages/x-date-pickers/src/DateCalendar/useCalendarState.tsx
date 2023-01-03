import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { SlideDirection } from './PickersSlideTransition';
import { useIsDateDisabled } from '../internals/hooks/validation/useDateValidation';
import { useUtils, useNow } from '../internals/hooks/useUtils';
import { MuiPickersAdapter } from '../internals/models';
import { clamp } from '../internals/utils/date-utils';
import type { DateCalendarDefaultizedProps } from './DateCalendar';

interface CalendarState<TDate> {
  currentMonth: TDate;
  focusedDay: TDate | null;
  isMonthSwitchingAnimating: boolean;
  slideDirection: SlideDirection;
}

type ReducerAction<TType, TAdditional = {}> = { type: TType } & TAdditional;

interface ChangeMonthPayload<TDate> {
  direction: SlideDirection;
  newMonth: TDate;
}

interface ChangeFocusedDayPayload<TDate> {
  focusedDay: TDate | null;
  /**
   * The update does not trigger month switching animation.
   * For example: when selecting month from the month view.
   */
  withoutMonthSwitchingAnimation?: boolean;
}

export const createCalendarStateReducer =
  <TDate extends unknown>(
    reduceAnimations: boolean,
    disableSwitchToMonthOnDayFocus: boolean,
    utils: MuiPickersAdapter<TDate>,
  ) =>
  (
    state: CalendarState<TDate>,
    action:
      | ReducerAction<'finishMonthSwitchingAnimation'>
      | ReducerAction<'changeMonth', ChangeMonthPayload<TDate>>
      | ReducerAction<'changeFocusedDay', ChangeFocusedDayPayload<TDate>>,
  ): CalendarState<TDate> => {
    switch (action.type) {
      case 'changeMonth':
        return {
          ...state,
          slideDirection: action.direction,
          currentMonth: action.newMonth,
          isMonthSwitchingAnimating: !reduceAnimations,
        };

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

        const needMonthSwitch =
          action.focusedDay != null &&
          !disableSwitchToMonthOnDayFocus &&
          !utils.isSameMonth(state.currentMonth, action.focusedDay);

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

interface CalendarStateInput<TDate>
  extends Pick<
    DateCalendarDefaultizedProps<TDate>,
    | 'value'
    | 'defaultCalendarMonth'
    | 'disableFuture'
    | 'disablePast'
    | 'minDate'
    | 'maxDate'
    | 'onMonthChange'
    | 'reduceAnimations'
    | 'shouldDisableDate'
  > {
  disableSwitchToMonthOnDayFocus?: boolean;
}

export const useCalendarState = <TDate extends unknown>({
  value,
  defaultCalendarMonth,
  disableFuture,
  disablePast,
  disableSwitchToMonthOnDayFocus = false,
  maxDate,
  minDate,
  onMonthChange,
  reduceAnimations,
  shouldDisableDate,
}: CalendarStateInput<TDate>) => {
  const now = useNow<TDate>();
  const utils = useUtils<TDate>();

  const reducerFn = React.useRef(
    createCalendarStateReducer<TDate>(
      Boolean(reduceAnimations),
      disableSwitchToMonthOnDayFocus,
      utils,
    ),
  ).current;

  const [calendarState, dispatch] = React.useReducer(reducerFn, {
    isMonthSwitchingAnimating: false,
    focusedDay: value || now,
    currentMonth: utils.startOfMonth(
      value ?? defaultCalendarMonth ?? clamp(utils, now, minDate, maxDate),
    ),
    slideDirection: 'left',
  });

  const handleChangeMonth = React.useCallback(
    (payload: ChangeMonthPayload<TDate>) => {
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

  const changeMonth = React.useCallback(
    (newDate: TDate) => {
      const newDateRequested = newDate;
      if (utils.isSameMonth(newDateRequested, calendarState.currentMonth)) {
        return;
      }

      handleChangeMonth({
        newMonth: utils.startOfMonth(newDateRequested),
        direction: utils.isAfterDay(newDateRequested, calendarState.currentMonth)
          ? 'left'
          : 'right',
      });
    },
    [calendarState.currentMonth, handleChangeMonth, utils],
  );

  const isDateDisabled = useIsDateDisabled({
    shouldDisableDate,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
  });

  const onMonthSwitchingAnimationEnd = React.useCallback(() => {
    dispatch({ type: 'finishMonthSwitchingAnimation' });
  }, []);

  const changeFocusedDay = useEventCallback(
    (newFocusedDate: TDate | null, withoutMonthSwitchingAnimation?: boolean) => {
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
    calendarState,
    changeMonth,
    changeFocusedDay,
    isDateDisabled,
    onMonthSwitchingAnimationEnd,
    handleChangeMonth,
  };
};

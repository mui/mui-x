import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { SlideDirection } from './PickersSlideTransition';
import { useIsDateDisabled } from './useIsDateDisabled';
import { useUtils, useNow } from '../internals/hooks/useUtils';
import { MuiPickersAdapter, PickersTimezone } from '../models';
import { DateCalendarDefaultizedProps } from './DateCalendar.types';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { SECTION_TYPE_GRANULARITY } from '../internals/utils/getDefaultReferenceDate';

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

interface UseCalendarStateParams<TDate>
  extends Pick<
    DateCalendarDefaultizedProps<TDate>,
    | 'value'
    | 'referenceDate'
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
  timezone: PickersTimezone;
}

export const useCalendarState = <TDate extends unknown>(params: UseCalendarStateParams<TDate>) => {
  const {
    value,
    referenceDate: referenceDateProp,
    defaultCalendarMonth,
    disableFuture,
    disablePast,
    disableSwitchToMonthOnDayFocus = false,
    maxDate,
    minDate,
    onMonthChange,
    reduceAnimations,
    shouldDisableDate,
    timezone,
  } = params;

  const now = useNow<TDate>(timezone);
  const utils = useUtils<TDate>();

  const reducerFn = React.useRef(
    createCalendarStateReducer<TDate>(
      Boolean(reduceAnimations),
      disableSwitchToMonthOnDayFocus,
      utils,
    ),
  ).current;

  const referenceDate = React.useMemo(
    () => {
      let externalReferenceDate: TDate | null = null;
      if (referenceDateProp) {
        externalReferenceDate = referenceDateProp;
      } else if (defaultCalendarMonth) {
        // For `defaultCalendarMonth`, we just want to keep the month and the year to avoid a behavior change.
        externalReferenceDate = utils.startOfMonth(defaultCalendarMonth);
      }

      return singleItemValueManager.getInitialReferenceValue({
        value,
        utils,
        timezone,
        props: params,
        referenceDate: externalReferenceDate,
        granularity: SECTION_TYPE_GRANULARITY.day,
      });
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const [calendarState, dispatch] = React.useReducer(reducerFn, {
    isMonthSwitchingAnimating: false,
    focusedDay: value || now,
    currentMonth: utils.startOfMonth(referenceDate),
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
    timezone,
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
    referenceDate,
    calendarState,
    changeMonth,
    changeFocusedDay,
    isDateDisabled,
    onMonthSwitchingAnimationEnd,
    handleChangeMonth,
  };
};

import * as React from 'react';
import { useUtils } from '../../hooks/useUtils';
import { MuiPickersAdapter } from '../../models/muiPickersAdapter';

interface FocusState<TDate> {
  focusedPicker: {
    year: number | null;
    month: number | null;
    day: TDate | null;
  };
  hasFocus: boolean;
}

type FocusModificationPayload<TDate> = { year: number } | { month: number } | { day: TDate };

type ReducerAction<TType, TAdditional = {}> = { type: TType } & TAdditional;

export const createCalendarStateReducer =
  <TDate extends unknown>(utils: MuiPickersAdapter<TDate>) =>
  (
    state: FocusState<TDate>,
    action:
      | ReducerAction<'focus', FocusModificationPayload<TDate>>
      | ReducerAction<'blur', FocusModificationPayload<TDate>>,
  ): FocusState<TDate> => {
    const { type, ...payload } = action;
    switch (type) {
      case 'focus':
        return {
          focusedPicker: {
            ...state.focusedPicker,
            ...payload,
          },
          hasFocus: true,
        };
      case 'blur':
        if (
          ('year' in payload && payload.year === state.focusedPicker.year) ||
          ('month' in payload && payload.month === state.focusedPicker.month) ||
          ('day' in payload &&
            state.focusedPicker.day !== null &&
            utils.isSameDay(payload.day, state.focusedPicker.day))
        ) {
          return { ...state, hasFocus: false };
        }
        return state;

      default:
        throw new Error('missing support');
    }
  };

interface FocusStateInput {
  autoFocus?: boolean;
}

export const useFocusManagement = <TDate extends unknown>({ autoFocus }: FocusStateInput) => {
  const utils = useUtils<TDate>();

  const reducerFn = React.useRef(createCalendarStateReducer<TDate>(utils)).current;

  const [viewFocusState, dispatch] = React.useReducer(reducerFn, {
    hasFocus: !!autoFocus,
    focusedPicker: {
      // Initialize to null such that the default logic can be set in component
      year: null,
      month: null,
      day: null,
    },
  });

  const onDayFocus = React.useCallback((day: TDate) => {
    dispatch({ type: 'focus', day });
  }, []);

  const onDayBlur = React.useCallback((day: TDate) => {
    dispatch({ type: 'blur', day });
  }, []);

  const onMonthFocus = React.useCallback((month: number) => {
    dispatch({ type: 'focus', month });
  }, []);

  const onMonthBlur = React.useCallback((month: number) => {
    dispatch({ type: 'blur', month });
  }, []);

  const onYearFocus = React.useCallback((year: number) => {
    dispatch({ type: 'focus', year });
  }, []);

  const onYearBlur = React.useCallback((year: number) => {
    dispatch({ type: 'blur', year });
  }, []);

  return {
    viewFocusState,
    onDayFocus,
    onDayBlur,
    onMonthFocus,
    onMonthBlur,
    onYearFocus,
    onYearBlur,
  };
};

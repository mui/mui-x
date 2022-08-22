import * as React from 'react';

interface FocusState {
  focusedPicker: 'year' | 'month' | 'day';
  hasFocus: boolean;
}

type FocusModificationPayload = { picker: 'year' | 'month' | 'day' };

type ReducerAction<TType, TAdditional = {}> = { type: TType } & TAdditional;

export const createCalendarStateReducer =
  () =>
  (
    state: FocusState,
    action:
      | ReducerAction<'focus', FocusModificationPayload>
      | ReducerAction<'blur', FocusModificationPayload>,
  ): FocusState => {
    const { type, picker } = action;
    switch (type) {
      case 'focus':
        return {
          focusedPicker: picker,
          hasFocus: true,
        };
      case 'blur':
        if (picker === state.focusedPicker) {
          return { ...state, hasFocus: false };
        }
        return state;

      default:
        throw new Error('missing support');
    }
  };

interface FocusStateInput {
  autoFocus?: boolean;
  openView: any;
}

export const useFocusManagement = ({ autoFocus, openView }: FocusStateInput) => {
  const reducerFn = React.useRef(createCalendarStateReducer()).current;

  const [viewFocusState, dispatch] = React.useReducer(reducerFn, {
    hasFocus: !!autoFocus,
    focusedPicker: openView,
  });

  const setPickerHasFocus = React.useCallback(
    (picker: 'year' | 'month' | 'day') => (newHasFocus: boolean) => {
      dispatch({ type: newHasFocus ? 'focus' : 'blur', picker });
    },
    [],
  );

  return {
    viewFocusState,
    setPickerHasFocus,
  };
};

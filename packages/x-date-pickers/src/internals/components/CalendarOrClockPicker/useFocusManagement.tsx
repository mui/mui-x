import * as React from 'react';
import { CalendarPickerView } from '../../models/views';

interface FocusState {
  focusedPicker: CalendarPickerView | null;
}

type FocusModificationPayload = { picker: CalendarPickerView };

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
        };
      case 'blur':
        if (picker === state.focusedPicker) {
          return { focusedPicker: null };
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
    focusedPicker: autoFocus ? openView : null,
  });

  const setPickerHasFocus = React.useCallback(
    (picker: CalendarPickerView) => (newHasFocus: boolean) => {
      dispatch({ type: newHasFocus ? 'focus' : 'blur', picker });
    },
    [],
  );

  return {
    focusedPicker: viewFocusState.focusedPicker,
    setPickerHasFocus,
  };
};

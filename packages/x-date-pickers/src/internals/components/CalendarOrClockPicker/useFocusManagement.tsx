import * as React from 'react';
import { CalendarPickerView } from '../../models/views';

interface FocusState {
  focusedView: CalendarPickerView | null;
}

type FocusModificationPayload = { view: CalendarPickerView };

type ReducerAction<TType, TAdditional = {}> = { type: TType } & TAdditional;

export const createCalendarStateReducer =
  () =>
  (
    state: FocusState,
    action:
      | ReducerAction<'focus', FocusModificationPayload>
      | ReducerAction<'blur', FocusModificationPayload>,
  ): FocusState => {
    const { type, view } = action;
    switch (type) {
      case 'focus':
        return {
          focusedView: view,
        };
      case 'blur':
        if (view === state.focusedView) {
          return { focusedView: null };
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
    focusedView: autoFocus ? openView : null,
  });

  const setFocusedView = React.useCallback(
    (view: CalendarPickerView) => (newHasFocus: boolean) => {
      dispatch({ type: newHasFocus ? 'focus' : 'blur', view });
    },
    [],
  );

  return {
    focusedView: viewFocusState.focusedView,
    setFocusedView,
  };
};

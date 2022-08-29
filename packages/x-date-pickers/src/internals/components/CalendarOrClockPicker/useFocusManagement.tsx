import * as React from 'react';
import { CalendarPickerView } from '../../models/views';

interface FocusStateInput {
  autoFocus?: boolean;
  openView: any;
}

export const useFocusManagement = ({ autoFocus, openView }: FocusStateInput) => {
  const [focusedView, setFocusedView] = React.useState<CalendarPickerView | null>(
    autoFocus ? openView : null,
  );

  const setFocusedViewCallback = React.useCallback(
    (view: CalendarPickerView) => (newHasFocus: boolean) => {
      if (newHasFocus) {
        setFocusedView(view);
      } else {
        setFocusedView((prevFocusedView) => (view === prevFocusedView ? null : prevFocusedView));
      }
    },
    [],
  );

  return {
    focusedView,
    setFocusedView: setFocusedViewCallback,
  };
};

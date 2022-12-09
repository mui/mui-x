import * as React from 'react';
import { DateOrTimeView } from '../../models/views';

interface FocusStateInput {
  autoFocus?: boolean;
  openView: any;
}

export const useFocusManagement = <TView extends DateOrTimeView>({
  autoFocus,
  openView,
}: FocusStateInput) => {
  const [focusedView, setFocusedView] = React.useState<TView | null>(autoFocus ? openView : null);

  const setFocusedViewCallback = React.useCallback(
    (view: TView) => (newHasFocus: boolean) => {
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

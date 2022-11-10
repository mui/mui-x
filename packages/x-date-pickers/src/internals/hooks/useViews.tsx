import * as React from 'react';
import { useControlled } from '@mui/material/utils';
import { arrayIncludes } from '../utils/utils';
import { PickerSelectionState } from './usePickerState';
import { CalendarOrClockPickerView } from '../models';

export type PickerOnChangeFn<TDate> = (
  date: TDate | null,
  selectionState?: PickerSelectionState,
) => void;

interface UseViewsOptions<TValue, View extends CalendarOrClockPickerView> {
  onChange: (value: TValue, selectionState?: PickerSelectionState) => void;
  onViewChange?: (newView: View) => void;
  openTo?: View;
  view: View | undefined;
  views: readonly View[];
}

export function useViews<TValue, View extends CalendarOrClockPickerView>({
  onChange,
  onViewChange,
  openTo,
  view,
  views,
}: UseViewsOptions<TValue, View>) {
  const [openView, setOpenView] = useControlled({
    name: 'Picker',
    state: 'view',
    controlled: view,
    default: openTo && arrayIncludes(views, openTo) ? openTo : views[0],
  });

  const openViewIndex = views.indexOf(openView);
  const previousView: View | null = views[openViewIndex - 1] ?? null;
  const nextView: View | null = views[openViewIndex + 1] ?? null;

  const changeView = React.useCallback(
    (newView: View) => {
      setOpenView(newView);

      if (onViewChange) {
        onViewChange(newView);
      }
    },
    [setOpenView, onViewChange],
  );

  const openNext = React.useCallback(() => {
    if (nextView) {
      changeView(nextView);
    }
  }, [nextView, changeView]);

  const handleChangeAndOpenNext = React.useCallback(
    (value: TValue, currentViewSelectionState?: PickerSelectionState) => {
      const isSelectionFinishedOnCurrentView = currentViewSelectionState === 'finish';
      const globalSelectionState =
        isSelectionFinishedOnCurrentView && Boolean(nextView)
          ? 'partial'
          : currentViewSelectionState;

      onChange(value, globalSelectionState);
      if (isSelectionFinishedOnCurrentView) {
        openNext();
      }
    },
    [nextView, onChange, openNext],
  );

  return {
    handleChangeAndOpenNext,
    nextView,
    previousView,
    openNext,
    openView,
    setOpenView: changeView,
  };
}

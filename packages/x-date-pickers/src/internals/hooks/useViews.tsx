import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { unstable_useControlled as useControlled } from '@mui/utils';
import type { PickerSelectionState } from './usePicker';
import { DateOrTimeView } from '../../models';
import { MakeOptional } from '../models/helpers';

export type PickerOnChangeFn<TDate> = (
  date: TDate | null,
  selectionState?: PickerSelectionState,
) => void;

export interface UseViewsOptions<TValue, TView extends unknown> {
  /**
   * Callback fired when the value changes.
   * @template TValue
   * @param {TValue} value The new value.
   * @param {PickerSelectionState | undefined} selectionState Indicates if the date selection is complete.
   */
  onChange: (value: TValue, selectionState?: PickerSelectionState) => void;
  /**
   * Callback fired on view change.
   * @template TView
   * @param {TView} view The new view.
   */
  onViewChange?: (view: TView) => void;
  /**
   * The default visible view.
   * Used when the component view is not controlled.
   * Must be a valid option from `views` list.
   */
  openTo?: TView;
  /**
   * The visible view.
   * Used when the component view is controlled.
   * Must be a valid option from `views` list.
   */
  view?: TView;
  /**
   * Available views.
   */
  views: readonly TView[];
  /**
   * If `true`, the main element is focused during the first mount.
   * This main element is:
   * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
   * - the `input` element if there is a field rendered.
   */
  autoFocus?: boolean;
  /**
   * Controlled focused view.
   */
  focusedView?: TView | null;
  /**
   * Callback fired on focused view change.
   * @template TView
   * @param {TView | null} view The new view to focus or not.
   * @param {boolean} hasFocus `true` if the view should be focused.
   */
  onFocusedViewChange?: (view: TView | null, hasFocus: boolean) => void;
}

export interface ExportedUseViewsOptions<TView extends DateOrTimeView>
  extends MakeOptional<Omit<UseViewsOptions<any, TView>, 'onChange'>, 'openTo' | 'views'> {}

let warnedOnceNotValidView = false;

interface UseViewsResponse<TValue, TView extends unknown> {
  view: TView;
  setView: (view: TView) => void;
  focusedView: TView | null;
  setFocusedView: (view: TView, hasFocus: boolean) => void;
  nextView: TView | null;
  previousView: TView | null;
  defaultView: TView;
  goToNextView: () => void;
  setValueAndGoToNextView: (
    value: TValue,
    currentViewSelectionState?: PickerSelectionState,
  ) => void;
}

export function useViews<TValue, TView extends unknown>({
  onChange,
  onViewChange,
  openTo,
  view: inView,
  views,
  autoFocus,
  focusedView: inFocusedView,
  onFocusedViewChange,
}: UseViewsOptions<TValue, TView>): UseViewsResponse<TValue, TView> {
  if (process.env.NODE_ENV !== 'production') {
    if (!warnedOnceNotValidView) {
      if (inView != null && !views.includes(inView)) {
        console.warn(
          `MUI: \`view="${inView}"\` is not a valid prop.`,
          `It must be an element of \`views=["${views.join('", "')}"]\`.`,
        );
        warnedOnceNotValidView = true;
      }

      if (inView == null && openTo != null && !views.includes(openTo)) {
        console.warn(
          `MUI: \`openTo="${openTo}"\` is not a valid prop.`,
          `It must be an element of \`views=["${views.join('", "')}"]\`.`,
        );
        warnedOnceNotValidView = true;
      }
    }
  }

  const previousOpenTo = React.useRef(openTo);
  const previousViews = React.useRef(views);
  const defaultView = React.useRef(views.includes(openTo!) ? openTo! : views[0]);
  const [view, setView] = useControlled({
    name: 'useViews',
    state: 'view',
    controlled: inView,
    default: defaultView.current,
  });

  const defaultFocusedView = React.useRef(autoFocus ? view : null);
  const [focusedView, setFocusedView] = useControlled({
    name: 'useViews',
    state: 'focusedView',
    controlled: inFocusedView,
    default: defaultFocusedView.current,
  });

  React.useEffect(() => {
    // Update the current view when `openTo` or `views` props change
    if (
      (previousOpenTo.current && previousOpenTo.current !== openTo) ||
      (previousViews.current &&
        previousViews.current.some((previousView) => !views.includes(previousView)))
    ) {
      setView(views.includes(openTo!) ? openTo! : views[0]);
    }
  }, [openTo, setView, view, views]);

  const viewIndex = views.indexOf(view);
  const previousView: TView | null = views[viewIndex - 1] ?? null;
  const nextView: TView | null = views[viewIndex + 1] ?? null;

  const handleChangeView = useEventCallback((newView: TView) => {
    if (newView === view) {
      return;
    }
    setView(newView);

    if (onViewChange) {
      onViewChange(newView);
    }
  });

  const handleFocusedViewChange = useEventCallback((viewToFocus: TView, hasFocus: boolean) => {
    if (hasFocus) {
      // Focus event
      setFocusedView(viewToFocus);
    } else {
      // Blur event
      setFocusedView(
        (prevFocusedView) => (viewToFocus === prevFocusedView ? null : prevFocusedView), // If false the blur is due to view switching
      );
    }

    onFocusedViewChange?.(viewToFocus, hasFocus);
  });

  const goToNextView = useEventCallback(() => {
    if (nextView) {
      handleChangeView(nextView);
      setTimeout(() => {
        handleFocusedViewChange(nextView, true);
      });
    }
  });

  const setValueAndGoToNextView = useEventCallback(
    (value: TValue, currentViewSelectionState?: PickerSelectionState) => {
      const isSelectionFinishedOnCurrentView = currentViewSelectionState === 'finish';
      const globalSelectionState =
        isSelectionFinishedOnCurrentView && Boolean(nextView)
          ? 'partial'
          : currentViewSelectionState;

      onChange(value, globalSelectionState);
      if (isSelectionFinishedOnCurrentView) {
        goToNextView();
      }
    },
  );

  return {
    view,
    setView: handleChangeView,
    focusedView,
    setFocusedView: handleFocusedViewChange,
    nextView,
    previousView,
    defaultView: defaultView.current,
    goToNextView,
    setValueAndGoToNextView,
  };
}

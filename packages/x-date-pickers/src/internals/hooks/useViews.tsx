import useEventCallback from '@mui/utils/useEventCallback';
import { unstable_useControlled as useControlled } from '@mui/utils';
import { arrayIncludes } from '../utils/utils';
import { PickerSelectionState } from './usePickerState';
import { DateOrTimeView } from '../models';
import { MakeOptional } from '../models/helpers';

export type PickerOnChangeFn<TDate> = (
  date: TDate | null,
  selectionState?: PickerSelectionState,
) => void;

export interface UseViewsOptions<TValue, TView extends DateOrTimeView> {
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
   * Initially opened view.
   * Must be a valid option from `views` list.
   */
  openTo?: TView;
  /**
   * Controlled visible view.
   */
  view?: TView;
  /**
   * Available views.
   */
  views: readonly TView[];
  /**
   * Set to `true` if focus should be moved to the current view.
   */
  autoFocus?: boolean;
  /**
   * Controlled focused view.
   */
  focusedView?: TView | null;
  /**
   * Callback fired on focused view change.
   * @template TView
   * @param {TView} view The new view to focus or not.
   * @param {boolean} hasFocus `true` if the view should be focused.
   */
  onFocusedViewChange?: (view: TView, hasFocus: boolean) => void;
}

export interface ExportedUseViewsOptions<TView extends DateOrTimeView>
  extends MakeOptional<Omit<UseViewsOptions<any, TView>, 'onChange'>, 'openTo' | 'views'> {}

let warnedOnceNotValidOpenTo = false;

export function useViews<TValue, TView extends DateOrTimeView>({
  onChange,
  onViewChange,
  openTo,
  view: inView,
  views,
  autoFocus,
  focusedView: inFocusedView,
  onFocusedViewChange,
}: UseViewsOptions<TValue, TView>) {
  if (process.env.NODE_ENV !== 'production') {
    if (!warnedOnceNotValidOpenTo && openTo != null && !views.includes(openTo)) {
      console.warn(
        `MUI: \`openTo="${openTo}"\` is not a valid prop.`,
        `It must be an element of \`views=["${views.join('", "')}"]\`.`,
      );
      warnedOnceNotValidOpenTo = true;
    }
  }

  const [view, setOpenView] = useControlled({
    name: 'useViews',
    state: 'view',
    controlled: inView,
    default: arrayIncludes(views, openTo) ? openTo : views[0],
  });

  const [focusedView, setFocusedView] = useControlled({
    name: 'useViews',
    state: 'focusedView',
    controlled: inFocusedView,
    default: autoFocus ? view : null,
  });

  const viewIndex = views.indexOf(view);
  const previousView: TView | null = views[viewIndex - 1] ?? null;
  const nextView: TView | null = views[viewIndex + 1] ?? null;

  const handleChangeView = useEventCallback((newView: TView) => {
    setOpenView(newView);

    if (onViewChange) {
      onViewChange(newView);
    }
  });

  const goToNextView = useEventCallback(() => {
    if (nextView) {
      handleChangeView(nextView);
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

  const handleFocusedViewChange = useEventCallback((viewToFocus: TView, hasFocus: boolean) => {
    if (hasFocus) {
      setFocusedView(viewToFocus);
    } else {
      setFocusedView((prevFocusedView) =>
        viewToFocus === prevFocusedView ? null : prevFocusedView,
      );
    }

    onFocusedViewChange?.(viewToFocus, hasFocus);
  });

  return {
    view,
    setView: handleChangeView,
    focusedView,
    setFocusedView: handleFocusedViewChange,
    nextView,
    previousView,
    goToNextView,
    setValueAndGoToNextView,
  };
}

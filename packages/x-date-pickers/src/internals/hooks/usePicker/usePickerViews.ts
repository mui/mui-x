import * as React from 'react';
import { CalendarOrClockPickerView } from '../../models';
import { useViews } from '../useViews';
import { PickerSelectionState } from '../usePickerState';
import { useIsLandscape } from '../useIsLandscape';

export type PickerViewRenderer<TValue, TView extends CalendarOrClockPickerView> = (
  props: PickerViewsRendererProps<TValue, TView>,
) => React.ReactElement;

export type PickerDateSectionModeLookup<TView extends CalendarOrClockPickerView> = Record<
  TView,
  'field' | 'view'
>;

export interface ExportedUsePickerViewProps<TView extends CalendarOrClockPickerView> {
  autoFocus?: boolean;
  /**
   * Make picker read only.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Force rendering in particular orientation.
   */
  orientation?: 'portrait' | 'landscape';
  /**
   * First view to show.
   */
  openTo: TView;
  /**
   * Callback fired on view change.
   * @template View
   * @param {View} view The new view.
   */
  onViewChange?: (view: TView) => void;
  /**
   * Array of views to show.
   */
  views: readonly TView[];
}

export interface UsePickerViewsProps<TValue, TView extends CalendarOrClockPickerView>
  extends ExportedUsePickerViewProps<TView> {
  onChange: (value: TValue, selectionState?: PickerSelectionState) => void;
  value: TValue;
}

interface UsePickerViewParams<TValue, TView extends CalendarOrClockPickerView> {
  props: UsePickerViewsProps<TValue, TView>;
  renderViews: PickerViewRenderer<TValue, TView>;
  sectionModeLookup?: PickerDateSectionModeLookup<TView>;
  open: boolean;
  onClose: () => void;
}

export interface PickerViewsRendererProps<TValue, TView extends CalendarOrClockPickerView>
  extends Pick<
    UsePickerViewsProps<TValue, TView>,
    'value' | 'onChange' | 'views' | 'onViewChange' | 'autoFocus'
  > {
  view: TView;
  value: TValue;
  isLandscape: boolean;
}

let warnedOnceNotValidOpenTo = false;

export const usePickerViews = <TValue, TView extends CalendarOrClockPickerView>({
  props,
  renderViews,
  sectionModeLookup,
  open,
  onClose,
}: UsePickerViewParams<TValue, TView>) => {
  const { views, openTo, onViewChange, onChange, orientation, ...other } = props;

  const isLandscape = useIsLandscape(views, orientation);

  if (process.env.NODE_ENV !== 'production') {
    if (!warnedOnceNotValidOpenTo && !views.includes(openTo)) {
      console.warn(
        `MUI: \`openTo="${openTo}"\` is not a valid prop.`,
        `It must be an element of \`views=["${views.join('", "')}"]\`.`,
      );
      warnedOnceNotValidOpenTo = true;
    }
  }

  // TODO: Stop using `useViews` ?
  const { openView, setOpenView, handleChangeAndOpenNext } = useViews<TValue, TView>({
    view: undefined,
    views,
    openTo,
    onChange,
    onViewChange,
  });

  React.useLayoutEffect(() => {
    if (!sectionModeLookup) {
      return;
    }

    const openViewMode = sectionModeLookup[openView];
    if (openViewMode === 'field' && open) {
      onClose();
    }
    console.log(openViewMode);
  }, [openView]); // eslint-disable-line react-hooks/exhaustive-deps

  return () =>
    renderViews({
      view: openView,
      onViewChange: setOpenView,
      onChange: handleChangeAndOpenNext,
      views,
      isLandscape,
      ...other,
    });
};

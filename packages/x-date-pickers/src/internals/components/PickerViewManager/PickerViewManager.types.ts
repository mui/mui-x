import * as React from 'react';
import { CalendarOrClockPickerView } from '../../models/views';
import { PickerSelectionState } from '../../hooks/usePickerState';

export type PickerViewRenderer<TValue> = (props: { value: TValue }) => React.ReactNode;

export interface PickerViewManagerProps<TValue, TDate, TView extends CalendarOrClockPickerView> {
  value: TValue;
  onChange: (value: TValue, selectionState?: PickerSelectionState) => void;
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
  viewRenderers: Record<TView, PickerViewRenderer<TValue>>;
}

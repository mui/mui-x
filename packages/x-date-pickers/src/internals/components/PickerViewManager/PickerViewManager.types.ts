import * as React from 'react';
import { CalendarOrClockPickerView } from '../../models/views';
import { PickerSelectionState } from '../../hooks/usePickerState';

export interface PickerViewsRendererProps<TValue, TDate, TView extends CalendarOrClockPickerView>
  extends Pick<
    PickerViewManagerProps<TValue, TDate, TView>,
    'value' | 'onChange' | 'views' | 'onViewChange' | 'autoFocus'
  > {
  view: TView;
}

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
  renderViews: (props: PickerViewsRendererProps<TValue, TDate, TView>) => React.ReactElement;
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
}

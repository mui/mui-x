import * as React from 'react';
import { CalendarOrClockPickerView } from '../views';

export interface BaseToolbarProps<TValue, TView extends CalendarOrClockPickerView>
  extends ExportedBaseToolbarProps {
  isLandscape: boolean;
  onChange: (newValue: TValue) => void;
  value: TValue;
  /**
   * Currently visible picker view.
   */
  view: TView;
  /**
   * Callback called when a toolbar is clicked
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: (view: TView) => void;
  views: readonly CalendarOrClockPickerView[];
  disabled?: boolean;
  readOnly?: boolean;
  // TODO v6: Remove
  isMobileKeyboardViewOpen?: boolean;
  // TODO v6: Remove
  toggleMobileKeyboardView?: () => void;
}

export interface ExportedBaseToolbarProps {
  /**
   * Toolbar date format.
   */
  toolbarFormat?: string;
  /**
   * Toolbar value placeholder—it is displayed when the value is empty.
   * @default "––"
   */
  toolbarPlaceholder?: React.ReactNode;
}

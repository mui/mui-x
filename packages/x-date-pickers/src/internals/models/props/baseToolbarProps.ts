import * as React from 'react';
import { CalendarOrClockPickerView } from '../views';

export interface BaseToolbarProps<TValue> extends ExportedBaseToolbarProps {
  isLandscape: boolean;
  onChange: (newValue: TValue) => void;
  value: TValue;
  view: CalendarOrClockPickerView;
  onViewChange: (view: CalendarOrClockPickerView) => void;
  views: readonly CalendarOrClockPickerView[];
  disabled?: boolean;
  readOnly?: boolean;
  // TODO v6: Remove
  isMobileKeyboardViewOpen: boolean;
  // TODO v6: Remove
  toggleMobileKeyboardView: () => void;
}

export interface BaseToolbarProps2<TValue>
  extends Omit<BaseToolbarProps<TValue>, 'isMobileKeyboardViewOpen' | 'toggleMobileKeyboardView'> {}

export interface ExportedBaseToolbarProps {
  /**
   * Date format.
   */
  toolbarFormat?: string;
  /**
   * Mobile picker date value placeholder, it is displayed when `value` === `null`.
   * @default '–'
   */
  toolbarPlaceholder?: React.ReactNode;
  /**
   * Mobile picker title.
   */
  toolbarTitle?: React.ReactNode;
}

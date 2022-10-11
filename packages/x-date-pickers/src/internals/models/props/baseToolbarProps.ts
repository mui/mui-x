import * as React from 'react';
import { CalendarOrClockPickerView } from '../views';
import type { PickerOnChangeFn } from '../../hooks/useViews';

export interface BaseToolbarProps<TDate, TValue> extends ExportedBaseToolbarProps {
  isLandscape: boolean;
  onChange: PickerOnChangeFn<TDate>;
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

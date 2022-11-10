import * as React from 'react';
import { CalendarOrClockPickerView } from '../views';
import type { PickerOnChangeFn } from '../../hooks/useViews';
import type { ExportedCalendarPickerProps } from '../../../CalendarPicker/CalendarPicker';
import type { ExportedClockPickerProps } from '../../../ClockPicker/ClockPicker';
import { PickerStatePickerProps } from '../../hooks/usePickerState';

export interface BaseToolbarProps<TDate, TValue>
  extends ExportedCalendarPickerProps<TDate>,
    ExportedClockPickerProps<TDate>,
    Omit<PickerStatePickerProps<TValue>, 'onDateChange'> {
  ampmInClock?: boolean;
  dateRangeIcon?: React.ReactNode;
  /**
   * Text for aria label of the button switching between input and interactive view.
   * @deprecated Use the translation key `inputModeToggleButtonAriaLabel` instead, see https://mui.com/x/react-date-pickers/localization
   * @param {boolean} isKeyboardInputOpen Indicates if the interface is the keyboard input.
   * @param {'calendar' | 'clock' } viewType Indicates if the interface is about a date or a time.
   * @returns {string} The arial label
   */
  getMobileKeyboardInputViewButtonText?: (
    isKeyboardInputOpen: boolean,
    viewType: 'calendar' | 'clock',
  ) => string;
  isLandscape: boolean;
  onChange: PickerOnChangeFn<TDate>;
  openView: CalendarOrClockPickerView;
  setOpenView: (view: CalendarOrClockPickerView) => void;
  timeIcon?: React.ReactNode;
  toolbarFormat?: string;
  toolbarPlaceholder?: React.ReactNode;
  toolbarTitle?: React.ReactNode;
  views: readonly CalendarOrClockPickerView[];
}

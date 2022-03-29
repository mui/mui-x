import * as React from 'react';
import { CalendarOrClockPickerView } from '../views';
import type { PickerOnChangeFn } from '../../hooks/useViews';
import type { ExportedCalendarPickerProps } from '../../../CalendarPicker/CalendarPicker';
import type { ExportedClockPickerProps } from '../../../ClockPicker/ClockPicker';

export interface BaseToolbarProps<TDate>
  extends ExportedCalendarPickerProps<TDate>,
    ExportedClockPickerProps<TDate> {
  ampmInClock?: boolean;
  date: TDate;
  dateRangeIcon?: React.ReactNode;
  getMobileKeyboardInputViewButtonText?: () => string;
  hideTabs?: boolean;
  isLandscape: boolean;
  isMobileKeyboardViewOpen: boolean;
  onChange: PickerOnChangeFn<TDate>;
  openView: CalendarOrClockPickerView;
  setOpenView: (view: CalendarOrClockPickerView) => void;
  timeIcon?: React.ReactNode;
  toggleMobileKeyboardView: () => void;
  toolbarFormat?: string;
  toolbarPlaceholder?: React.ReactNode;
  toolbarTitle?: React.ReactNode;
  views: readonly CalendarOrClockPickerView[];
}

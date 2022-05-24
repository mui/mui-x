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
  getMobileKeyboardInputViewButtonText?: () => string;
  hideTabs?: boolean;
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

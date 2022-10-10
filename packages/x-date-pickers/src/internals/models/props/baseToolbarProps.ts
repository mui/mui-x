import * as React from 'react';
import { CalendarOrClockPickerView } from '../views';
import type { PickerOnChangeFn } from '../../hooks/useViews';
import type { ExportedCalendarPickerProps } from '../../../CalendarPicker/CalendarPicker';
import type { ExportedClockPickerProps } from '../../../ClockPicker/ClockPicker';
import { PickerStatePickerProps } from '../../hooks/usePickerState';

export interface BaseToolbarProps<TDate, TValue>
  extends ExportedBaseToolbarProps,
    ExportedCalendarPickerProps<TDate>,
    ExportedClockPickerProps<TDate>,
    Omit<PickerStatePickerProps<TValue>, 'onDateChange'> {
  ampmInClock?: boolean;
  dateRangeIcon?: React.ReactNode;
  isLandscape: boolean;
  onChange: PickerOnChangeFn<TDate>;
  openView: CalendarOrClockPickerView;
  setOpenView: (view: CalendarOrClockPickerView) => void;
  timeIcon?: React.ReactNode;
  views: readonly CalendarOrClockPickerView[];
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

import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import {
  BaseDateValidationProps,
  DefaultizedProps,
  ExportedDayPickerProps,
  DayPickerSlotsComponent,
  DayPickerSlotsComponentsProps,
  PickersArrowSwitcherSlotsComponent,
  PickersArrowSwitcherSlotsComponentsProps,
  PickerSelectionState,
} from '@mui/x-date-pickers/internals';
import { DateRange, DayRangeValidationProps } from '../internal/models';
import { DateRangeCalendarClasses } from './dateRangeCalendarClasses';
import { DateRangePickerDayProps } from '../DateRangePickerDay';

export interface DateRangeCalendarSlotsComponent<TDate>
  extends PickersArrowSwitcherSlotsComponent,
    Omit<DayPickerSlotsComponent<TDate>, 'Day'> {
  /**
   * Custom component for day in range pickers.
   * Check the [DateRangePickersDay](https://mui.com/x/api/date-pickers/date-range-picker-day/) component.
   * @default DateRangePickersDay
   */
  Day?: React.ElementType<DateRangePickerDayProps<TDate>>;
}

export interface DateRangeCalendarSlotsComponentsProps<TDate>
  extends PickersArrowSwitcherSlotsComponentsProps,
    Omit<DayPickerSlotsComponentsProps<TDate>, 'Day'> {}

export interface DateRangeCalendarProps<TDate>
  extends ExportedDayPickerProps<TDate>,
    BaseDateValidationProps<TDate>,
    DayRangeValidationProps<TDate> {
  autoFocus?: boolean;
  className?: string;
  classes?: Partial<DateRangeCalendarClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<DateRangeCalendarSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<DateRangeCalendarSlotsComponentsProps<TDate>>;
  /**
   * If `true`, after selecting `start` date calendar will not automatically switch to the month of `end` date.
   * @default false
   */
  disableAutoMonthSwitching?: boolean;
  value: DateRange<TDate>;
  /**
   * Default calendar month displayed when `value={[null, null]}`.
   */
  defaultCalendarMonth?: TDate;
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled?: boolean;
  onChange: (newValue: DateRange<TDate>, selectionState?: PickerSelectionState) => void;
  /**
   * Make picker read only.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Disable heavy animations.
   * @default typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent)
   */
  reduceAnimations?: boolean;
  /**
   * Callback firing on month change @DateIOType.
   * @template TDate
   * @param {TDate} month The new month.
   * @returns {void|Promise} -
   */
  onMonthChange?: (month: TDate) => void | Promise<void>;
  currentDatePosition: 'start' | 'end';
  onCurrentDatePositionChange: (newPosition: 'start' | 'end') => void;
  /**
   * The number of calendars to render.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
}

export type DateRangeCalendarDefaultizedProps<TDate> = DefaultizedProps<
  DateRangeCalendarProps<TDate>,
  'reduceAnimations' | 'calendars' | keyof BaseDateValidationProps<TDate>
>;

export type ExportedDateRangeCalendarProps<TDate> = Omit<
  DateRangeCalendarProps<TDate>,
  | 'value'
  | 'onChange'
  | 'changeView'
  | 'slideDirection'
  | 'currentMonth'
  | 'className'
  | 'classes'
  | 'components'
  | 'componentsProps'
  | 'currentDatePosition'
  | 'onCurrentDatePositionChange'
>;

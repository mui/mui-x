import * as React from 'react';
import { SxProps } from '@mui/system';
import { SlotComponentProps } from '@mui/base';
import { Theme } from '@mui/material/styles';
import {
  BaseDateValidationProps,
  DefaultizedProps,
  ExportedDayCalendarProps,
  DayCalendarSlotsComponent,
  DayCalendarSlotsComponentsProps,
  PickersArrowSwitcherSlotsComponent,
  PickersArrowSwitcherSlotsComponentsProps,
  PickerSelectionState,
  PickersCalendarHeaderSlotsComponent,
  PickersCalendarHeaderSlotsComponentsProps,
  DayCalendarProps,
} from '@mui/x-date-pickers/internals';
import { DateRange, RangePositionProps, DayRangeValidationProps } from '../internal/models';
import { DateRangeCalendarClasses } from './dateRangeCalendarClasses';
import { DateRangePickerDay, DateRangePickerDayProps } from '../DateRangePickerDay';

export type DateRangePosition = 'start' | 'end';

export interface DateRangeCalendarSlotsComponent<TDate>
  extends PickersArrowSwitcherSlotsComponent,
    Omit<DayCalendarSlotsComponent<TDate>, 'Day'>,
    PickersCalendarHeaderSlotsComponent {
  /**
   * Custom component for day in range pickers.
   * Check the [DateRangePickersDay](https://mui.com/x/api/date-pickers/date-range-picker-day/) component.
   * @default DateRangePickersDay
   */
  Day?: React.ElementType<DateRangePickerDayProps<TDate>>;
}

export interface DateRangeCalendarSlotsComponentsProps<TDate>
  extends PickersArrowSwitcherSlotsComponentsProps,
    Omit<DayCalendarSlotsComponentsProps<TDate>, 'day'>,
    PickersCalendarHeaderSlotsComponentsProps<TDate> {
  day?: SlotComponentProps<
    typeof DateRangePickerDay,
    {},
    DayCalendarProps<TDate> & { day: TDate; selected: boolean }
  >;
}

export interface DateRangeCalendarProps<TDate>
  extends ExportedDayCalendarProps<TDate>,
    BaseDateValidationProps<TDate>,
    DayRangeValidationProps<TDate>,
    Partial<RangePositionProps> {
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value?: DateRange<TDate>;
  /**
   * The default selected value.
   * Used when the component is not controlled.
   */
  defaultValue?: DateRange<TDate>;
  /**
   * Callback fired when the value changes.
   * @template TDate
   * @param {DateRange<TDate>} value The new value.
   * @param {PickerSelectionState | undefined} selectionState Indicates if the date range selection is complete.
   */
  onChange?: (value: DateRange<TDate>, selectionState?: PickerSelectionState) => void;
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
  components?: DateRangeCalendarSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DateRangeCalendarSlotsComponentsProps<TDate>;
  /**
   * If `true`, after selecting `start` date calendar will not automatically switch to the month of `end` date.
   * @default false
   */
  disableAutoMonthSwitching?: boolean;
  /**
   * Default calendar month displayed when `value={[null, null]}`.
   */
  defaultCalendarMonth?: TDate;
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled?: boolean;
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
  /**
   * The number of calendars to render.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
  /**
   * If `true`, editing dates by dragging is disabled.
   * @default false
   */
  disableDragEditing?: boolean;
}

export interface DateRangeCalendarOwnerState<TDate> extends DateRangeCalendarProps<TDate> {
  isDragging: boolean;
}

export type DateRangeCalendarDefaultizedProps<TDate> = DefaultizedProps<
  DateRangeCalendarProps<TDate>,
  'reduceAnimations' | 'calendars' | 'disableDragEditing' | keyof BaseDateValidationProps<TDate>
>;

export type ExportedDateRangeCalendarProps<TDate> = Omit<
  DateRangeCalendarProps<TDate>,
  | 'defaultValue'
  | 'value'
  | 'onChange'
  | 'changeView'
  | 'slideDirection'
  | 'currentMonth'
  | 'className'
  | 'classes'
  | 'components'
  | 'componentsProps'
  | 'rangePosition'
  | 'onRangePositionChange'
>;

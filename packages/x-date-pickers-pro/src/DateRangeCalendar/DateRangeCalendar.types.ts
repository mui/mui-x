import * as React from 'react';
import { SxProps } from '@mui/system';
import { SlotComponentProps } from '@mui/utils';
import { Theme } from '@mui/material/styles';
import { PickerValidDate, TimezoneProps } from '@mui/x-date-pickers/models';
import {
  PickersCalendarHeader,
  PickersCalendarHeaderSlots,
  PickersCalendarHeaderSlotProps,
} from '@mui/x-date-pickers/PickersCalendarHeader';
import {
  BaseDateValidationProps,
  DefaultizedProps,
  ExportedDayCalendarProps,
  DayCalendarSlots,
  DayCalendarSlotProps,
  PickersArrowSwitcherSlots,
  PickersArrowSwitcherSlotProps,
  DayCalendarProps,
  ExportedUseViewsOptions,
} from '@mui/x-date-pickers/internals';
import { DayRangeValidationProps } from '../internals/models/dateRange';
import { DateRange, RangePosition } from '../models';
import { DateRangeCalendarClasses } from './dateRangeCalendarClasses';
import { DateRangePickerDay, DateRangePickerDayProps } from '../DateRangePickerDay';
import { UseRangePositionProps } from '../internals/hooks/useRangePosition';
import { PickersRangeCalendarHeaderProps } from '../PickersRangeCalendarHeader';

export interface DateRangeCalendarSlots<TDate extends PickerValidDate>
  extends PickersArrowSwitcherSlots,
    Omit<DayCalendarSlots<TDate>, 'day'>,
    PickersCalendarHeaderSlots {
  /**
   * Custom component for calendar header.
   * Check the [PickersCalendarHeader](https://mui.com/x/api/date-pickers/pickers-calendar-header/) component.
   * @default PickersCalendarHeader
   */
  calendarHeader?: React.ElementType<PickersRangeCalendarHeaderProps<TDate>>;
  /**
   * Custom component for day in range pickers.
   * Check the [DateRangePickersDay](https://mui.com/x/api/date-pickers/date-range-picker-day/) component.
   * @default DateRangePickersDay
   */
  day?: React.ElementType<DateRangePickerDayProps<TDate>>;
}

export interface DateRangeCalendarSlotProps<TDate extends PickerValidDate>
  extends PickersArrowSwitcherSlotProps,
    Omit<DayCalendarSlotProps<TDate>, 'day'>,
    PickersCalendarHeaderSlotProps<TDate> {
  calendarHeader?: SlotComponentProps<
    typeof PickersCalendarHeader,
    {},
    DateRangeCalendarProps<TDate>
  >;
  day?: SlotComponentProps<
    typeof DateRangePickerDay,
    {},
    DayCalendarProps<TDate> & { day: TDate; selected: boolean }
  >;
}

export interface ExportedDateRangeCalendarProps<TDate extends PickerValidDate>
  extends ExportedDayCalendarProps<TDate>,
    BaseDateValidationProps<TDate>,
    DayRangeValidationProps<TDate>,
    TimezoneProps {
  /**
   * If `true`, after selecting `start` date calendar will not automatically switch to the month of `end` date.
   * @default false
   */
  disableAutoMonthSwitching?: boolean;
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
   * If `true`, disable heavy animations.
   * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
   */
  reduceAnimations?: boolean;
  /**
   * Callback fired on month change.
   * @template TDate
   * @param {TDate} month The new month.
   */
  onMonthChange?: (month: TDate) => void;
  /**
   * Position the current month is rendered in.
   * @default 1
   */
  currentMonthCalendarPosition?: 1 | 2 | 3;
  /**
   * If `true`, editing dates by dragging is disabled.
   * @default false
   */
  disableDragEditing?: boolean;
}

export interface DateRangeCalendarProps<TDate extends PickerValidDate>
  extends ExportedDateRangeCalendarProps<TDate>,
    UseRangePositionProps,
    ExportedUseViewsOptions<'day'> {
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
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`.
   */
  referenceDate?: TDate;
  /**
   * The number of calendars to render.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateRangeCalendarClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DateRangeCalendarSlots<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateRangeCalendarSlotProps<TDate>;
  /**
   * Range positions available for selection.
   * This list is checked against when checking if a next range position can be selected.
   *
   * Used on Date Time Range pickers with current `rangePosition` to force a `finish` selection after just one range position selection.
   * @default ['start', 'end']
   */
  availableRangePositions?: RangePosition[];
}

export interface DateRangeCalendarOwnerState<TDate extends PickerValidDate>
  extends DateRangeCalendarProps<TDate> {
  isDragging: boolean;
}

export type DateRangeCalendarDefaultizedProps<TDate extends PickerValidDate> = DefaultizedProps<
  DateRangeCalendarProps<TDate>,
  | 'views'
  | 'openTo'
  | 'reduceAnimations'
  | 'calendars'
  | 'disableDragEditing'
  | 'availableRangePositions'
  | keyof BaseDateValidationProps<TDate>
>;

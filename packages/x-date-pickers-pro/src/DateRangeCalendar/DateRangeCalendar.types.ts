import * as React from 'react';
import { SxProps } from '@mui/system';
import { SlotComponentProps } from '@mui/base/utils';
import { Theme } from '@mui/material/styles';
import { TimezoneProps } from '@mui/x-date-pickers/models';
import {
  PickersCalendarHeaderSlotsComponent,
  PickersCalendarHeaderSlotsComponentsProps,
} from '@mui/x-date-pickers/PickersCalendarHeader';
import {
  BaseDateValidationProps,
  DefaultizedProps,
  ExportedDayCalendarProps,
  DayCalendarSlotsComponent,
  DayCalendarSlotsComponentsProps,
  PickersArrowSwitcherSlotsComponent,
  PickersArrowSwitcherSlotsComponentsProps,
  PickerSelectionState,
  DayCalendarProps,
  ExportedUseViewsOptions,
  UncapitalizeObjectKeys,
} from '@mui/x-date-pickers/internals';
import { DateRange, DayRangeValidationProps } from '../internals/models';
import { DateRangeCalendarClasses } from './dateRangeCalendarClasses';
import { DateRangePickerDay, DateRangePickerDayProps } from '../DateRangePickerDay';
import { UseRangePositionProps } from '../internals/hooks/useRangePosition';

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

export interface ExportedDateRangeCalendarProps<TDate>
  extends ExportedDayCalendarProps,
    BaseDateValidationProps<TDate>,
    DayRangeValidationProps<TDate>,
    TimezoneProps,
    // TODO: Add the other props of `ExportedUseViewOptions` once `DateRangeCalendar` handles several views
    Pick<ExportedUseViewsOptions<'day'>, 'autoFocus'> {
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
   * If `true`, disable heavy animations.
   * @default `@media(prefers-reduced-motion: reduce)` || typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent)
   */
  reduceAnimations?: boolean;
  /**
   * Callback fired on month change.
   * @template TDate
   * @param {TDate} month The new month.
   */
  onMonthChange?: (month: TDate) => void;
  /**
   * The number of calendars to render.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
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

export interface DateRangeCalendarProps<TDate>
  extends ExportedDateRangeCalendarProps<TDate>,
    UseRangePositionProps {
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
  className?: string;
  classes?: Partial<DateRangeCalendarClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: DateRangeCalendarSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: DateRangeCalendarSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<DateRangeCalendarSlotsComponent<TDate>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateRangeCalendarSlotsComponentsProps<TDate>;
}

export interface DateRangeCalendarOwnerState<TDate> extends DateRangeCalendarProps<TDate> {
  isDragging: boolean;
}

export type DateRangeCalendarDefaultizedProps<TDate> = DefaultizedProps<
  DateRangeCalendarProps<TDate>,
  'reduceAnimations' | 'calendars' | 'disableDragEditing' | keyof BaseDateValidationProps<TDate>
>;

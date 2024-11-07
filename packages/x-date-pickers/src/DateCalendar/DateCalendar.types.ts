import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { SlotComponentProps } from '@mui/utils';
import { DefaultizedProps } from '@mui/x-internals/types';
import {
  PickersCalendarHeader,
  PickersCalendarHeaderProps,
  PickersCalendarHeaderSlots,
  PickersCalendarHeaderSlotProps,
} from '../PickersCalendarHeader';
import { DayCalendarSlots, DayCalendarSlotProps, ExportedDayCalendarProps } from './DayCalendar';
import { DateCalendarClasses } from './dateCalendarClasses';
import { BaseDateValidationProps } from '../internals/models/validation';
import { ExportedUseViewsOptions } from '../internals/hooks/useViews';
import { DateView, PickerValidDate, TimezoneProps } from '../models';
import {
  ExportedYearCalendarProps,
  YearCalendarSlots,
  YearCalendarSlotProps,
} from '../YearCalendar/YearCalendar.types';
import {
  ExportedMonthCalendarProps,
  MonthCalendarSlots,
  MonthCalendarSlotProps,
} from '../MonthCalendar/MonthCalendar.types';
import { ExportedValidateDateProps } from '../validation/validateDate';

export interface DateCalendarSlots
  extends PickersCalendarHeaderSlots,
    DayCalendarSlots,
    MonthCalendarSlots,
    YearCalendarSlots {
  /**
   * Custom component for calendar header.
   * Check the [PickersCalendarHeader](https://mui.com/x/api/date-pickers/pickers-calendar-header/) component.
   * @default PickersCalendarHeader
   */
  calendarHeader?: React.ElementType<PickersCalendarHeaderProps>;
}

export interface DateCalendarSlotProps
  extends PickersCalendarHeaderSlotProps,
    DayCalendarSlotProps,
    MonthCalendarSlotProps,
    YearCalendarSlotProps {
  calendarHeader?: SlotComponentProps<typeof PickersCalendarHeader, {}, DateCalendarProps>;
}

export interface ExportedDateCalendarProps
  extends ExportedDayCalendarProps,
    ExportedMonthCalendarProps,
    ExportedYearCalendarProps,
    ExportedValidateDateProps,
    TimezoneProps {
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
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => <span>...</span>
   */
  renderLoading?: () => React.ReactNode;
  /**
   * Callback fired on year change.
   * @param {PickerValidDate} year The new year.
   */
  onYearChange?: (year: PickerValidDate) => void;
  /**
   * Callback fired on month change.
   * @param {PickerValidDate} month The new month.
   */
  onMonthChange?: (month: PickerValidDate) => void;
}

export interface DateCalendarProps
  extends ExportedDateCalendarProps,
    ExportedUseViewsOptions<PickerValidDate | null, DateView> {
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value?: PickerValidDate | null;
  /**
   * The default selected value.
   * Used when the component is not controlled.
   */
  defaultValue?: PickerValidDate | null;
  /**
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`.
   */
  referenceDate?: PickerValidDate;
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateCalendarClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: DateCalendarSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: DateCalendarSlotProps;
}

export type DateCalendarDefaultizedProps = DefaultizedProps<
  DateCalendarProps,
  | 'views'
  | 'openTo'
  | 'loading'
  | 'reduceAnimations'
  | 'renderLoading'
  | keyof BaseDateValidationProps
>;

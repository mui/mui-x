import type * as React from 'react';
import { type SxProps } from '@mui/system';
import { type Theme } from '@mui/material/styles';
import { type SlotComponentProps } from '@mui/utils/types';
import { type DefaultizedProps } from '@mui/x-internals/types';
import {
  type PickersCalendarHeader,
  type PickersCalendarHeaderProps,
  type PickersCalendarHeaderSlots,
  type PickersCalendarHeaderSlotProps,
} from '../PickersCalendarHeader';
import {
  type DayCalendarSlots,
  type DayCalendarSlotProps,
  type ExportedDayCalendarProps,
} from './DayCalendar';
import { type DateCalendarClasses } from './dateCalendarClasses';
import { type BaseDateValidationProps } from '../internals/models/validation';
import { type ExportedUseViewsOptions } from '../internals/hooks/useViews';
import {
  type DateView,
  type PickerOwnerState,
  type PickerValidDate,
  type TimezoneProps,
} from '../models';
import {
  type ExportedYearCalendarProps,
  type YearCalendarSlots,
  type YearCalendarSlotProps,
} from '../YearCalendar/YearCalendar.types';
import {
  type ExportedMonthCalendarProps,
  type MonthCalendarSlots,
  type MonthCalendarSlotProps,
} from '../MonthCalendar/MonthCalendar.types';
import { type ExportedValidateDateProps } from '../validation/validateDate';
import { type FormProps } from '../internals/models/formProps';
import { type PickerValue } from '../internals/models';

export interface DateCalendarSlots
  extends PickersCalendarHeaderSlots, DayCalendarSlots, MonthCalendarSlots, YearCalendarSlots {
  /**
   * Custom component for calendar header.
   * Check the [PickersCalendarHeader](https://mui.com/x/api/date-pickers/pickers-calendar-header/) component.
   * @default PickersCalendarHeader
   */
  calendarHeader?: React.ElementType<PickersCalendarHeaderProps>;
}

export interface DateCalendarSlotProps
  extends
    PickersCalendarHeaderSlotProps,
    DayCalendarSlotProps,
    MonthCalendarSlotProps,
    YearCalendarSlotProps {
  calendarHeader?: SlotComponentProps<typeof PickersCalendarHeader, {}, PickerOwnerState>;
}

export interface ExportedDateCalendarProps
  extends
    ExportedDayCalendarProps,
    ExportedMonthCalendarProps,
    ExportedYearCalendarProps,
    ExportedValidateDateProps,
    TimezoneProps,
    FormProps {
  /**
   * If `true`, disable heavy animations.
   * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
   */
  reduceAnimations?: boolean;
  /**
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => <span>…</span>
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
  extends ExportedDateCalendarProps, ExportedUseViewsOptions<PickerValue, DateView> {
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

import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import {
  PickersCalendarHeaderSlotsComponent,
  PickersCalendarHeaderSlotsComponentsProps,
} from './PickersCalendarHeader';
import {
  DayCalendarSlotsComponent,
  DayCalendarSlotsComponentsProps,
  ExportedDayCalendarProps,
} from './DayCalendar';
import { DateCalendarClasses } from './dateCalendarClasses';
import {
  BaseDateValidationProps,
  YearValidationProps,
  MonthValidationProps,
  DayValidationProps,
} from '../internals/hooks/validation/models';
import { PickerSelectionState } from '../internals/hooks/usePicker/usePickerValue';
import { ExportedUseViewsOptions } from '../internals/hooks/useViews';
import { DateView } from '../internals/models/views';
import { DefaultizedProps } from '../internals/models/helpers';

export interface DateCalendarSlotsComponent<TDate>
  extends PickersCalendarHeaderSlotsComponent,
    DayCalendarSlotsComponent<TDate> {}

export interface DateCalendarSlotsComponentsProps<TDate>
  extends PickersCalendarHeaderSlotsComponentsProps<TDate>,
    DayCalendarSlotsComponentsProps<TDate> {}

export interface ExportedDateCalendarProps<TDate>
  extends ExportedDayCalendarProps<TDate>,
    BaseDateValidationProps<TDate>,
    DayValidationProps<TDate>,
    YearValidationProps<TDate>,
    MonthValidationProps<TDate> {
  /**
   * Default calendar month displayed when `value={null}`.
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
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => <span data-mui-test="loading-progress">...</span>
   */
  renderLoading?: () => React.ReactNode;
  /**
   * Callback firing on year change @DateIOType.
   * @template TDate
   * @param {TDate} year The new year.
   */
  onYearChange?: (year: TDate) => void;
  /**
   * Callback firing on month change @DateIOType.
   * @template TDate
   * @param {TDate} month The new month.
   * @returns {void|Promise} -
   */
  onMonthChange?: (month: TDate) => void | Promise<void>;
}

export interface DateCalendarProps<TDate>
  extends ExportedDateCalendarProps<TDate>,
    ExportedUseViewsOptions<DateView> {
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value?: TDate | null;
  /**
   * The default selected value.
   * Used when the component is not controlled.
   */
  defaultValue?: TDate | null;
  /**
   * Callback fired when the value changes.
   * @template TDate
   * @param {TDate | null} value The new value.
   * @param {PickerSelectionState | undefined} selectionState Indicates if the date selection is complete.
   */
  onChange?: (value: TDate | null, selectionState?: PickerSelectionState) => void;
  className?: string;
  classes?: Partial<DateCalendarClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DateCalendarSlotsComponent<TDate>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DateCalendarSlotsComponentsProps<TDate>;
}

export type DateCalendarDefaultizedProps<TDate> = DefaultizedProps<
  DateCalendarProps<TDate>,
  | 'views'
  | 'openTo'
  | 'loading'
  | 'reduceAnimations'
  | 'renderLoading'
  | keyof BaseDateValidationProps<TDate>
>;
